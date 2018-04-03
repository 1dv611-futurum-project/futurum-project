/**
 * Handles the logic regarding the server connaction.
 */

// Imports
import * as events from 'events';
import IMAPConnectionInterface from './IMAPConnectionInterface';

// This should be a database, only array for development
const whitelist = ['mopooy@gmail.com'];

/**
 * Sets up a connection to the server and
 * listens for incoming messages.
 */
class IMAPHandler extends events.EventEmitter {

  private imapConnection: IMAPConnectionInterface;
  private ongoingTimeout: number;

  /**
   * Connects to the imap server.
   */
  public connect(imapConnection: IMAPConnectionInterface): void {
    this.imapConnection = imapConnection;

    this.imapConnection.once('ready', this.handleInitialConnect.bind(this));
    this.imapConnection.on('error', this.handleConnectionError.bind(this));
    this.imapConnection.on('mail', this.handleNewMailEvent.bind(this));
    this.imapConnection.on('change', this.handleServerChange.bind(this));
    this.imapConnection.on('server', this.handleServerMessage.bind(this));
    process.on('exit', this.handleCleanup.bind(this));

    this.imapConnection.connect();
  }

  /**
   * Collects the unread emails from the Imap-connection,
   * marks them as read, and listens for incoming mails.
   * Sets up an interval-listener to keep checking for unread mails,
   * in case the connection fails to notify of them.
   */
  private handleInitialConnect(): void {
    this.imapConnection.getUnreadEmails()
    .then(() => {
      return this.imapConnection.listenForNewEmails();
    })
    .then(() => {
      // Set up timeout to check for new emails every other minute, to make sure they are not lost
      this.ongoingTimeout = setTimeout(this.imapConnection.getUnreadEmails(), 20000);
    })
    .catch((err) => {
      this.handleConnectionError(err);
    });
  }

  /**
   * Emits the new mail as a message.
   */
  private handleNewMailEvent(mail: object): void {
    // TODO: Check against whitelist to take different actions. emit it out under differend event-names?.
    this.emitMessage(mail);
  }

  /**
   * Emits a mail-event with the email.
   */
  private emitMessage(message: object): void {
    this.emit('mail', message);
  }

  /**
   * Emits connection errors.
   */
  private handleConnectionError(err: Error): void {
    console.log('Got connection error');
    console.log(err);
    this.emit('error', err);
  }

  /**
   * Emits that the server has sent a message.
   */
  private handleServerMessage(payload: object): void {
    console.log('Server Message');
    this.emit('message', payload);
  }

  /**
   * Emits that the server has changed.
   */
  private handleServerChange(payload: object): void {
    console.log('Server changed');
    this.emit('tamper', payload);
  }

  /**
   * Removes the connection and the interval.
   */
  private handleCleanup(): void {
    console.log('Process exit');
    if (this.ongoingTimeout) {
      clearTimeout(this.ongoingTimeout);
    }

    this.imapConnection.closeConnection();
  }
}

// Exports.
export default new IMAPHandler();
