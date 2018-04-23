/**
 * Handles the logic regarding the server connaction.
 */

// Imports
import * as events from 'events';
import IMAPConnectionInterface from './IMAPConnectionInterface';

// This should be a database, only array for development
const whitelist = ['mopooy@gmail.com', 'js223zs@student.lnu.se'];

/**
 * Sets up a connection to the server and
 * listens for incoming messages.
 */
class IMAPHandler extends events.EventEmitter {

  private interval: number;
  private imapConnection: IMAPConnectionInterface;
  private ongoingTimeout: number;

  /**
   * Connects to the imap server.
   */
  public connect(imapConnection: IMAPConnectionInterface, interval?: number): void {
    this.imapConnection = imapConnection;
    this.interval = interval || 60000;

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
      this.ongoingTimeout = setTimeout(() => { this.getUnreadEmails(); }, this.interval);
    })
    .catch((err) => {
      this.handleConnectionError(err);
    });
  }

  /**
   * Emits the new mail as a message.
   */
  private handleNewMailEvent(mail: object): void {
    const message = this.formatMail(mail);
    if (this.ongoingTimeout) {
      clearTimeout(this.ongoingTimeout);
    }
    this.emitMessage(message);
    this.ongoingTimeout = setTimeout(() => { this.getUnreadEmails(); }, this.interval);
  }

  /**
   * Collects unread emails and sets timeout for collecting them again.
   */
  private getUnreadEmails(): void {
    this.imapConnection.getUnreadEmails();
    if (this.ongoingTimeout) {
      clearTimeout(this.ongoingTimeout);
    }
    this.ongoingTimeout = setTimeout(() => { this.getUnreadEmails(); }, this.interval);
  }

  /**
   * Formats the mail.
   */
  private formatMail(mail) {
    let formatted;
    if (this.isNewTicket(mail)) {
      formatted = this.formatAsNewTicket(mail);
      if (!this.isInWhitelist(mail.from[0].address)) {
        formatted.type = 'forward';
      }
    } else {
      formatted = this.formatAsAnswer(mail);
    }

    return formatted;
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
    const message = {
      type: 'mail',
      id: 0,
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

  /**
   * Formats as an answer.
   */
  private formatAsAnswer(mail) {
    const message = {
      type: 'answer',
      mailID: mail.messageId,
      inAnswerTo: mail.references[0],
      received: mail.receivedDate,
      body: mail.text,
      fromCustomer: true
    };

    return message;
  }

  /**
   * Checks if the sender is in the whitelist.
   */
  private isInWhitelist(address: string) {
    // Commented out whitelist-testing.
    /*let found = false;
    // TODO: Logic.
    whitelist.forEach((approved) => {
      if (address.indexOf(approved) !== -1) {
        return found = true;
      }
    });

    return found;*/

    // Everyone is whitelist now.
    return true;
  }

  /**
   * Emits a mail-event with the email.
   */
  private emitMessage(message: object): void {
    this.emit(message.type, message);
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
