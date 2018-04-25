/**
 * Acts as a wrapper for the connection against the email server.
 */

// Imports
import * as Imap from 'imap';
import { Box, ImapMessage } from 'imap';
import * as events from 'events';
import { MailParser } from 'mailparser-mit';
import IMAPConnectionInterface from './interfaces/IMAPConnectionInterface';
import XOauth from './Xoauth2Generator';
import { Xoauth2Generator } from './Xoauth2Generator';
import { IMAPError } from './../../config/errors';
import { IMAPConnectionEvent } from './events/IMAPConnectionEvents';

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
class Connection extends events.EventEmitter implements IMAPConnectionInterface {

  private boxName = 'INBOX';
  private imap: Imap;
  private xoauthGenerator: Xoauth2Generator;
  private isConnected: boolean;

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
  public getUnreadEmails(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.collectAndEmitUnread()
      .then(() => {
        resolve();
      })
      .catch((err) => {
        this.handleConnectionError(new IMAPError(err));
      });
    });
  }

  /**
   * Listen for incoming emails and emits a message when they are recieved.
   */
  public listenForNewEmails(): Promise<void> {
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
      this.emitMessage(IMAPConnectionEvent.UNAUTH);
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
      this.emitMessage(IMAPConnectionEvent.READY);
    })
    .catch((err: Error) => {
      this.handleConnectionError(new IMAPError(err));
    });
  }

  /**
   * Opens the inbox.
   * Returns a Promise that resolves with the open box.
   */
  private openInbox(): Promise<void> {
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
  private collectAndEmitUnread(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.collectUnread()
      .then((emails: object[]) => {
        if (emails) {
          emails.forEach((message: object) => {
            this.emitMessage(IMAPConnectionEvent.READY, message);
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
  private collectUnread(): Promise<object[]> {
    return new Promise((resolve, reject) => {
      const messages = [];
      const fortnightAgo = new Date(Date.now() - 12096e5);
      this.imap.search( [['OR', 'RECENT', [ 'UNSEEN', ['SINCE', fortnightAgo] ] ] ],
      (err: Error, indicesToFetch: number[]) => {
        if (err) {
          return reject({message: 'An error occured while searching the inbox for unread messages.'});
        }

        if (indicesToFetch.length === 0) {
          return resolve(null);
        }

        const fetchMessages = this.imap.fetch(indicesToFetch, {
          bodies: ['']
        });

        fetchMessages.on('message', (msg: ImapMessage, seqno: number) => {
          msg.on('body', (stream: NodeJS.ReadableStream, info: object) => {
            const mp = new MailParser();
            stream.pipe(mp);

            mp.on('end', (mail: object) => {
              messages.push(mail);
              if (messages.length === indicesToFetch.length) {
                resolve(messages);
              }
            });
          });

          fetchMessages.on('end', () => {
            this.imap.setFlags(indicesToFetch, ['\\Seen'], (error: Error) => {
              if (error) {
                this.emitMessage(IMAPConnectionEvent.ERROR, new IMAPError('Error marking messages as read.'));
              }
            });
          });
        });

        fetchMessages.once('error', (error: Error) => {
          reject(new IMAPError('Error marking messages as read in the inbox.'));
        });
      });
    });
  }

  /**
   * Emits connection errors.
   */
  private handleConnectionError(err: Error): void {
    this.isConnected = false;
    this.emitMessage(IMAPConnectionEvent.ERROR, new IMAPError(err || 'An error with the IMAP Connection occured.'));
  }

  /**
   * Emits connection-end events.
   */
  private handleConnectionEnd(): void {
    this.isConnected = false;
    this.emitMessage(IMAPConnectionEvent.SERVER, {message: 'Connection to the IMAP-server has ended.'});
  }

  /**
   * Emits connection-end events.
   */
  private handleServerMessage(message: string): void {
    this.emitMessage(IMAPConnectionEvent.SERVER, {message});
  }

  /**
   * Emits connection-change events.
   */
  private handleServerChange(seqno, info): void {
    if ((info && info.flags && info.flags.indexOf('\\Seen') === -1) || !info) {
      this.emitMessage(IMAPConnectionEvent.CHANGE, {
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
export default new Connection();
export type IMAPConnection = Connection;
