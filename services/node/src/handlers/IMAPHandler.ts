/**
 * Handles the connection against the email server.
 */

// Imports
import * as Imap from 'imap';
import * as util from 'util';


//This should be a database, only array for development
const whitelist = ['mopooy@gmail.com']

/**
 * Sets up a connection to the server and
 * listens for incoming messages.
 */
class IMAPHandler {

  private imap: Imap;

  /**
   * Sets local variables, configs and imap-connaction listeners.
   */
  constructor() {
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
      //emit out all the unread messages as if they came in now
      console.log('got old mails')
      console.log(emails);
      this.imap.once('mail', this.handleNewMailEvent.bind(this));
    })
    .catch((err) => {
      // Send email somewhere
      console.log('Got error, need to handle this');
    });
  }

    /**
   * Collects the unread emails from the Imap-connection,
   * marks them as read, and saves them in unread.
   */
  private handleNewMailEvent(): void {
    console.log('handling new mail event')
    this.openInbox()
    .then((box) => {
      return this.collectUnread(box);
    })
    .then((emails) => {
      console.log('got new mails:')
      //emit out all the unread messages
      console.log(emails);
    })
    .catch((err) => {
      // Send email somewhere
      console.log('Got error, need to handle this');
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

        const f = this.imap.seq.fetch(results, {
          bodies: ['HEADER.FIELDS (FROM SUBJECT DATE)', '1'],
          markSeen: true
        });

        f.on('message', (msg, seqno) => {
          const message = {};
          const prefix = '(#' + seqno + ') ';

          msg.on('body', (stream, info) => {
            let buffer = '';
            let count = 0;

            stream.on('data', (chunk) => {
              count += chunk.length;
              buffer += chunk.toString('utf8');
            });

            stream.once('end', () => {
              if (info.which !== '1') {
                const headers = Imap.parseHeader(buffer);

                message.date = headers.date[0];
                message.sender = headers.from[0];
                message.title = headers.subject[0];
              } else {
                message.body = buffer;
              }
            });
          });

          msg.once('end', () => {
            messages.push(message);
          });
        });

        f.once('error', (error) => {
          reject(error);
        });

        f.once('end', () => {
          resolve(messages);
          resolve();
        });
      });
    });
  }

  /**
   * Logs connection errors.
   */
  private handleConnectionError(err): void {
    //TODO: Handle error? Send note to client about error? Log emails? Investigate.
    console.log('Got connection error');
    console.log(err);
  }

  /**
   * Notifies that the connection has ended.
   */
  private handleConnectionEnd(): void {
    //TODO: Handle end? Send note to client that connection is not up?
    console.log('Connection ended');
  }
}

// Exports.
export default new IMAPHandler();
