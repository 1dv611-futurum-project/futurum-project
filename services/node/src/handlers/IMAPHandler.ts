/**
 * Handles the connection against the email server.
 */

// Imports
import * as Imap from 'imap';
import * as util from 'util';
import * as events from 'events';
import * as MailParser from 'mailparser-mit';

// This should be a database, only array for development
const whitelist = ['mopooy@gmail.com'];

/**
 * Sets up a connection to the server and
 * listens for incoming messages.
 */
class IMAPHandler extends events.EventEmitter {

  private imap: Imap;

  /**
   * Sets local variables, configs and imap-connaction listeners.
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
  }

  /**
   * Connects to the imap server.
   */
  public connect(): void {
    this.imap.connect();
  }

  /**
   * Collects the unread emails from the Imap-connection,
   * marks them as read, and listens for incoming mails.
   */
  private handleInitialConnect(): void {
    this.openInbox()
    .then((box) => {
      return this.collectUnread(box);
    })
    .then((emails) => {
      this.imap.once('mail', this.handleNewMailEvent.bind(this));

      if (emails) {
        emails.forEach((message) => {
          this.emitMessage(message);
        });
      }
    })
    .catch((err) => {
      // Send email somewhere
      console.log('Got error, need to handle this');
      console.log(err);
    });
  }

  /**
   * Collects the unread emails from the Imap-connection,
   * marks them as read, and emits them as events.
   */
  private handleNewMailEvent(): void {
    this.openInbox()
    .then((box) => {
      return this.collectUnread(box);
    })
    .then((emails) => {
      if (emails) {
        emails.forEach((message) => {
          this.emitMessage(message);
        });
      }
    })
    .catch((err) => {
      // Send email somewhere
      console.log('Got error, need to handle this');
      console.log(err);
    });
  }

  /**
   * Opens the inbox.
   * Returns a Promise that resolves with the open box.
   */
  private openInbox(): Promise {
    return new Promise((resolve, reject) => {
      this.imap.openBox('INBOX', false, (err, box) => {
        if (err) {
          reject(err);
        }

        resolve(box);
      });
    });
  }

  /**
   * Collects all the unread messages in the open box provided.
   */
  private collectUnread(box): Promise {
    return new Promise((resolve, reject) => {
      const messages = [];
      this.imap.search([ 'UNSEEN' ], (err, results) => {
        if (err) {
          reject(err);
        }

        if (results.length === 0) {
          return resolve();
        }

        const f = this.imap.seq.fetch(results, {
          bodies: [''],
          markSeen: false
        });

        f.on('message', (msg, seqno) => {
          const prefix = '(#' + seqno + ') ';

          msg.on('body', (stream, info) => {
            const mp = new MailParser.MailParser();
            stream.pipe(mp);

            mp.on('end', (obj) => {
              const message = {};
              message.recieved = obj.date;
              message.title = obj.subject;
              message.from = obj.from[0].address;
              message.body = obj.text;
              messages.push(message);

              if (messages.length === results.length) {
                resolve(messages);
              }
            });
          });
        });

        f.once('error', (error) => {
          reject(error);
        });
      });
    });
  }

  /**
   * Emits a message-event with the message.
   */
  private emitMessage(message: object): void {
    this.emit('message', message);
  }

  /**
   * Logs connection errors.
   */
  private handleConnectionError(err): void {
    // TODO: Handle error? Send note to client about error? Log emails? Investigate.
    console.log('Got connection error');
    console.log(err);
  }

  /**
   * Notifies that the connection has ended.
   */
  private handleConnectionEnd(): void {
    // TODO: Handle end? Send note to client that connection is not up?
    console.log('Connection ended');
  }
}

// Exports.
export default new IMAPHandler();
