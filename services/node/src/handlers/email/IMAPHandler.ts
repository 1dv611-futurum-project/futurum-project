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
      // TODO: Set up interval to check for new emails, to make sure they are not lost
    })
    .catch((err) => {
      this.handleConnectionError(err);
    });
  }

  /**
   * Emits the new mail as a message.
   */
  private handleNewMailEvent(mail: object): void {
    // TODO: Check against whitelist to take different actions.
    // TODO: Save the mail in the database, or notify database handler? Or is that done from somewhere else?
    this.emitMessage(mail);
  }

  /**
   * Emits a message-event with the email.
   */
  private emitMessage(message: object): void {
    this.emit('message', message);
  }

  /**
   * Logs connection errors.
   */
  private handleConnectionError(err: Error): void {
    // TODO: Handle error? Send note to client about error? Log emails? Investigate.
    console.log('Got connection error');
    console.log(err);
  }

  /**
   * Notifies that the server has sent a message.
   */
  private handleServerMessage(payload: object): void {
    // TODO: Handle message? Send note to client that connection might go down?
    console.log('Server Message');
  }

  /**
   * Notifies that the server has changed.
   */
  private handleServerChange(payload: object): void {
    // TODO: Handle change? Send note to client that connection is being tampered with?
    console.log('Server changed');
  }
}

// Exports.
export default new IMAPHandler();
