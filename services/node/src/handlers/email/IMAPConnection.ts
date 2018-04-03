/**
 * Acts as a wrapper for the connection against the email server.
 */

// Imports
import * as Imap from 'imap';
import { Box, ImapMessage } from 'imap';
import * as events from 'events';
import * as MailParser from 'mailparser-mit';
import IMAPConnectionInterface from './IMAPConnectionInterface';

/**
 * Sets up a connection to the imap-server.
 * Emits events ['ready', 'error', 'mail', 'server', 'change']
 * Ready when connection is up and inbox is open.
 * Error on any error, with a payload with the error message.
 * Mail when a new unread email is found.
 * Server on any message from the imap server.
 * Change when someone is accessing the emails externally in some way
 * and validity of server might be compromised.
 */
class IMAPConnection extends events.EventEmitter implements IMAPConnectionInterface {

  private boxName = 'INBOX';
  private imap: Imap;

  /**
   * Sets local variables, configs and imap-connection listeners.
   */
  constructor() {
    super();

    this.imap = new Imap({
      user: process.env.IMAP_USER,
      password: process.env.IMAP_PASSWORD,
      host: 'imap.gmail.com',
      port: 993,
      tls: true
    });

    this.imap.once('ready', this.handleInitialConnect.bind(this));
    this.imap.once('error', this.handleConnectionError.bind(this));
    this.imap.once('end', this.handleConnectionEnd.bind(this));
    this.imap.on('alert', this.handleServerMessage.bind(this));
    this.imap.on('expunge', this.handleServerChange.bind(this));
    this.imap.on('update', this.handleServerChange.bind(this));
    this.imap.on('uidvalidity', this.handleServerChange.bind(this));
  }

  /**
   * Connects to the imap server.
   */
  public connect(): void {
    this.imap.connect();
  }

  /**
   * Returns an array of objects representing the unread emails
   * and emits a message event for each unread email.
   */
  public getUnreadEmails(): Promise {
    return new Promise((resolve, reject) => {
      this.collectAndEmitUnread()
      .then(() => {
        resolve()
      })
      .catch((err) => {
        this.handleConnectionError({message: err.message})
      })
    });
  } 

  /**
   * Listen for incoming emails and emits a message when they are recieved.
   */
  public listenForNewEmails(): Promise {
    return new Promise((resolve, reject) => {
      this.imap.once('mail', this.collectAndEmitUnread.bind(this));
      resolve()
    });
  }

  /**
   * Collects the unread emails from the Imap-connection,
   * marks them as read, and listens for incoming mails.
   */
  private handleInitialConnect(): void {
    this.openInbox()
    .then(() => {
      this.emitMessage('ready')
    })
    .catch((err: Error) => {
      this.handleConnectionError({message: err.message})
    });
  }

  /**
   * Opens the inbox.
   * Returns a Promise that resolves with the open box.
   */
  private openInbox(): Promise {
    return new Promise((resolve, reject) => {
      const readonly = false
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
        return resolve()
      })
      .catch((err: Error) => {
        this.handleConnectionError({message: err.message})
        return reject({message: err.message})
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

        const fetchMessages = this.imap.seq.fetch(indicesToFetch, {
          bodies: [''],
          markSeen: true
        });

        fetchMessages.on('message', (msg: ImapMessage, seqno: number) => {
          msg.on('body', (stream: ReadableStream, info: object) => {
            const mp = new MailParser.MailParser();
            stream.pipe(mp);

            mp.on('end', (obj: object) => {
              const message = {};
              message.recieved = obj.date;
              message.title = obj.subject;
              message.from = obj.from[0].address;
              message.body = obj.text;
              messages.push(message);

              if (messages.length === indicesToFetch.length) {
                resolve(messages);
              }
            });
          });
        });

        fetchMessages.once('error', (error: Error) => {
          // TODO: Log what message it concerned? Do something to make emails unread again?
          reject({message: 'An error occured while fetching unread messages.'});
        });
      });
    });
  }

  /**
   * Emits connection errors.
   */
  private handleConnectionError(err): void {
    this.emitMessage('error', {message: 'An error with the IMAP-connection occured.'})
  }

  /**
   * Emits connection-end events.
   */
  private handleConnectionEnd(): void {
    this.emitMessage('server', {message: 'Connection to the IMAP-server has ended.'})
  }

  /**
   * Emits connection-end events.
   */
  private handleServerMessage(message: string): void {
    this.emitMessage('server', {message: message})
  }

  /**
   * Emits connection-end events.
   */
  private handleServerChange(seqno, info): void {
    if (info.flags.indexOf('\\Seen') === -1) {
      this.emitMessage('change', {message: 'Someone or something is accessing the emails externally, server should probably be restarted to ensure continued validity.'})
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
