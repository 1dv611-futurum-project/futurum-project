/**
 * Handles the logic regarding the server connaction.
 */

// Imports
import * as events from 'events';
import IMAPConnectionInterface from './interfaces/IMAPConnectionInterface';
import IReceivedEmail from './interfaces/IReceivedEmail';
import IReceivedTicket from './interfaces/IReceivedTicket';
import IReceivedAnswer from './interfaces/IReceivedAnswer';

// This should be a database, only array for development
const whitelist = ['mopooy@gmail.com', 'js223zs@student.lnu.se'];

/**
 * Sets up a connection to the server and
 * listens for incoming messages.
 */
class IMAPHandler extends events.EventEmitter {

  private static TICKET = 'mail';
  private static ANSWER = 'answer';
  private static FORWARD = 'forward';

  private interval: number;
  private imapConnection: IMAPConnectionInterface;
  private ongoingTimeout: NodeJS.Timer;

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
      // Set up timeout to check for new emails every minute, to make sure they are not lost
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
  private handleNewMailEvent(mail: IReceivedEmail): void {
    const mailType = this.getType(mail);
    let formattedMessage;

    if (mailType === IMAPHandler.TICKET || mailType === IMAPHandler.FORWARD) {
      formattedMessage = this.formatAsNewTicket(mail);
    } else {
      formattedMessage = this.formatAsAnswer(mail);
    }

    this.emitMessage(formattedMessage, mailType);

    if (this.ongoingTimeout) {
      clearTimeout(this.ongoingTimeout);
    }
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
   * Gets the type of the mail.
   */
  private getType(mail: IReceivedEmail): string {
    let type;

    if (this.isNewTicket(mail)) {
      type = IMAPHandler.TICKET;
      if (!this.isInWhitelist(mail.from[0].address)) {
        type = IMAPHandler.FORWARD;
      }
    } else {
      type = IMAPHandler.ANSWER;
    }

    return type;
  }

  /**
   * Checks if the mail is new or an answer.
   */
  private isNewTicket(mail: IReceivedEmail): boolean {
    return mail.references === undefined;
  }

  /**
   * Formats the mail as a new ticket.
   */
  private formatAsNewTicket(mail: IReceivedEmail): IReceivedTicket {
    const message = ({} as IReceivedTicket);

    // TODO: possibly remove later when database in place?
    message.status = 0;
    message.assignee = null;

    message.mailID = mail.messageId;
    message.created = mail.receivedDate;
    message.title = mail.subject;
    message.from = {
      name: mail.from[0].name,
      email: mail.from[0].address
    };
    message.messages = [
      {
        received: mail.receivedDate,
        body: mail.text,
        fromCustomer: true
      }
    ];

    return message;
  }

  /**
   * Formats as an answer.
   */
  private formatAsAnswer(mail: IReceivedEmail): IReceivedAnswer {
    const message = ({} as IReceivedAnswer);

    message.mailID = mail.messageId;
    message.inAnswerTo = mail.references[0];
    message.received = mail.receivedDate;
    message.body = mail.text;
    message.fromCustomer = true;

    return message;
  }

  /**
   * Checks if the sender is in the whitelist.
   */
  private isInWhitelist(address: string): boolean {
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
   * Emits the given event with the given mail.
   */
  private emitMessage(mail: object, mailType: string): void {
    this.emit(mailType, mail);
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
    this.emit('message', payload);
  }

  /**
   * Emits that the server has changed.
   */
  private handleServerChange(payload: object): void {
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
export type IMAPConnectionHandler = IMAPHandler;
