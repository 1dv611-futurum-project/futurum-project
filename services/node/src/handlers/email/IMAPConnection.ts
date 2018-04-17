/**
 * Acts as a wrapper for the connection against the email server.
 */

// Imports
import * as Imap from 'imap';
import { Box, ImapMessage } from 'imap';
import * as events from 'events';
import * as MailParser from 'mailparser-mit';
import IMAPConnectionInterface from './IMAPConnectionInterface';
import XOauth from './Xoauth2Generator';

/**
 * Sets up a connection to the imap-server.
 * Emits events ['ready', 'error', 'mail', 'server', 'change', 'unauth']
 * Ready when connection is up and inbox is open.
 * Error on any error, with a payload with the error message.
 * Mail when a new unread email is found.
 * Server on any message from the imap server.
 * Change when someone is accessing the emails externally in some way
 * and validity of server might be compromised.
 * Unauth when credentials are missing and the connection cannot be established.
 */
class IMAPConnection extends events.EventEmitter implements IMAPConnectionInterface {

  private boxName = 'INBOX';
  private imap: Imap;
  private xoauthGenerator: XOauth;
  private isConnected: boolean;
  private id = 0;

  constructor() {
    super();
    this.xoauthGenerator = XOauth;
  }

  /**
   * Updates or creates the imap connection and the xoauth-generator.
   */
  public updateCredentials(): void {
    XOauth.updateGenerator();

    if (this.imap) {
      this.closeConnection();
    }

    this.connect();
  }

  /**
   * Returns an array of objects representing the unread emails
   * and emits a message event for each unread email.
   */
  public getUnreadEmails(): Promise {
    return new Promise((resolve, reject) => {
      this.collectAndEmitUnread()
      .then(() => {
        resolve();
      })
      .catch((err) => {
        this.handleConnectionError({message: err.message});
      });
    });
  }

  /**
   * Listen for incoming emails and emits a message when they are recieved.
   */
  public listenForNewEmails(): Promise {
    return new Promise((resolve, reject) => {
      this.imap.once('mail', this.collectAndEmitUnread.bind(this));
      resolve();
    });
  }

  /**
   * Closes the imap-connection.
   */
  public closeConnection(): void {
    this.imap.end();
  }

  /**
   * Connects to the imap server.
   */
  private connect(): void {
    if (!this.xoauthGenerator) {
      this.emitMessage('unauth');
    } else {
      this.xoauthGenerator.getToken()
      .then((token) => {
        this.imap = new Imap({
          xoauth2: token,
          host: 'imap.gmail.com',
          port: 993,
          tls: true,
		  tlsOptions: { rejectUnauthorized: false }
        });

        this.imap.once('ready', this.handleInitialConnect.bind(this));
        this.imap.once('error', this.handleConnectionError.bind(this));
        this.imap.once('end', this.handleConnectionEnd.bind(this));
        this.imap.on('alert', this.handleServerMessage.bind(this));
        this.imap.on('expunge', this.handleServerChange.bind(this));
        this.imap.on('update', this.handleServerChange.bind(this));
        this.imap.on('uidvalidity', this.handleServerChange.bind(this));

        this.imap.connect();
      })
      .catch((error) => {
        this.handleConnectionError(error);
      });
    }
  }

  /**
   * Collects the unread emails from the Imap-connection,
   * marks them as read, and listens for incoming mails.
   */
  private handleInitialConnect(): void {
    this.openInbox()
    .then(() => {
      this.isConnected = true;
      this.emitMessage('ready');
    })
    .catch((err: Error) => {
      this.handleConnectionError({message: err.message});
    });
  }

  /**
   * Opens the inbox.
   * Returns a Promise that resolves with the open box.
   */
  private openInbox(): Promise {
    return new Promise((resolve, reject) => {
      const readonly = false;
      this.imap.openBox(this.boxName, readonly, (err: Error, box: Box) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }

  /**
   * Collects the unread emails from the Imap-connection,
   * marks them as read, and emits them as events.
   */
  private collectAndEmitUnread(): Promise {
    return new Promise((resolve, reject) => {
      this.collectUnread()
      .then((emails: object[]) => {
        if (emails) {
          emails.forEach((message: object) => {
            this.emitMessage('mail', message);
          });
        }
        return resolve();
      })
      .catch((err: Error) => {
        this.handleConnectionError(err);
        return reject(err);
      });
    });
  }

  /**
   * Collects all the unread messages in the open box.
   */
  private collectUnread(): Promise {
    return new Promise((resolve, reject) => {
      const messages = [];
      this.imap.search([ 'UNSEEN' ], (err: Error, indicesToFetch: number[]) => {
        if (err) {
          return reject({message: 'An error occured while searching the inbox for unread messages.'});
        }

        if (indicesToFetch.length === 0) {
          return resolve();
        }

        const fetchMessages = this.imap.fetch(indicesToFetch, {
          bodies: ['']
        });

        fetchMessages.on('message', (msg: ImapMessage, seqno: number) => {
          msg.on('body', (stream: ReadableStream, info: object) => {
            const mp = new MailParser.MailParser();
            stream.pipe(mp);

            mp.on('end', (mail: object) => {
              const message = this.formatMail(mail);
              messages.push(message);

              if (messages.length === indicesToFetch.length) {
                resolve(messages);
              }
            });
          });
        });

        fetchMessages.on('end', () => {
          this.imap.setFlags(indicesToFetch, ['\\Seen'], (error: Error) => {
            if (error) {
              this.emitMessage('error', {message: 'Error marking messages as read in the inbox.'});
            }
          });
        });

        fetchMessages.once('error', (error: Error) => {
          reject({type: 'fetch', message: 'An error occured while fetching unread messages.'});
        });
      });
    });
  }

  /**
   * Formats the mail.
   */
  private formatMail(mail) {
    if (this.isNewTicket(mail)) {
      return this.formatAsNewTicket(mail);
    }

    return this.formatAsAnswer(mail);
  }

  /**
   * Checks if the mail is new or an answer.
   */
  private isNewTicket(mail) {
    return mail.references === undefined;
  }

  /**
   * Formats the mail as a new ticket.
   */
  private formatAsNewTicket(mail) {
    let message = {
      type: 'ticket',
      id: this.id++,
      status: 0,
      assignee: null,
      mailID: mail.messageId,
      created: mail.receivedDate,
      title: mail.subject,
      from: {
        name: mail.from[0].name,
        email: mail.from[0].address
      },
      messages: [
        {
          received: mail.receivedDate,
          body: mail.text,
          fromCustomer: true
        }
      ]
    };

    return message;
  }

  private formatAsAnswer(mail) {
    //TODO
  }

  /**
   * Emits connection errors.
   */
  private handleConnectionError(err: object): void {
    this.isConnected = false;
    const error = {};
    error.message = err.message || 'An error with the IMAP-connection occured.';
    error.type = err.type || 'Connection';
    this.emitMessage('error', error);
  }

  /**
   * Emits connection-end events.
   */
  private handleConnectionEnd(): void {
    this._isConnected = false;
    this.emitMessage('server', {message: 'Connection to the IMAP-server has ended.'});
  }

  /**
   * Emits connection-end events.
   */
  private handleServerMessage(message: string): void {
    this.emitMessage('server', {message});
  }

  /**
   * Emits connection-end events.
   */
  private handleServerChange(seqno, info): void {
    if (info.flags.indexOf('\\Seen') === -1) {
      this.emitMessage('change', {
        message: 'Someone or something is accessing the emails externally, ' +
        'server should probably be restarted to ensure continued validity.'
      });
    }
  }

  /**
   * Emits the given event with the given payload.
   */
  private emitMessage(event: string, payload?: object): void {
    this.emit(event, payload);
  }
}

// Exports.
export default new IMAPConnection();
