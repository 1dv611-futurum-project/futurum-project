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

    this.imapConnection.on('ready', this.handleInitialConnect.bind(this));
    this.imapConnection.on('error', this.handleConnectionError.bind(this));
    this.imapConnection.on('unauth', this.handleConnectionAuth.bind(this));
    this.imapConnection.on('mail', this.handleNewMailEvent.bind(this));
    this.imapConnection.on('change', this.handleServerChange.bind(this));
    this.imapConnection.on('server', this.handleServerMessage.bind(this));
    process.on('exit', this.handleCleanup.bind(this));

    this.imapConnection.updateCredentials();
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
      // Set up timeout to check for new emails every five minutes, to make sure they are not lost
      if (this.ongoingTimeout) {
        clearTimeout(this.ongoingTimeout);
      }
      this.ongoingTimeout = setTimeout(() => { this.getUnreadEmails(); }, 300000);
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
    if (this.ongoingTimeout) {
      clearTimeout(this.ongoingTimeout);
    }
    this.emitMessage(mail);
    this.ongoingTimeout = setTimeout(() => { this.getUnreadEmails(); }, 300000);
  }

  /**
   * Collects unread emails and sets timeout for collecting them again.
   */
  private getUnreadEmails() {
    this.imapConnection.getUnreadEmails();
    if (this.ongoingTimeout) {
      clearTimeout(this.ongoingTimeout);
    }
    this.ongoingTimeout = setTimeout(() => { this.getUnreadEmails(); }, 300000);
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
    this.emit('error', err);
  }

  /**
   * Emits unauth errors.
   */
  private handleConnectionAuth(): void {
    this.emit('unauth', {message: 'User credentails are missing.'});
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
    if (this.ongoingTimeout) {
      clearTimeout(this.ongoingTimeout);
    }

    this.imapConnection.closeConnection();
  }
}

// Exports.
export default new IMAPHandler();
