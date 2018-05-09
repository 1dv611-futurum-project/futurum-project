/**
 * Handles the logic regarding the server connaction.
 */

// Imports
import * as events from 'events';
import * as planer from 'planer';
import { JSDOM } from 'jsdom';
import * as h2p from 'html2plaintext';
import IMAPConnectionInterface from './../interfaces/IMAPConnectionInterface';
import IReceivedEmail from './../interfaces/IReceivedEmail';
import IReceivedTicket from './../interfaces/IReceivedTicket';
import IReceivedAnswer from './../interfaces/IReceivedAnswer';
import { IMAPConnectionEvent } from './../events/IMAPConnectionEvents';
import { IncomingMailEvent } from './../events/IncomingMailEvents';
import { IMAPError, DBError } from './../../../config/errors';
import MailSender from './MailSender';

/**
 * Sets up a connection to the server and
 * listens for incoming messages.
 */
class MailReciever extends events.EventEmitter {

  private interval: number;
  private imapConnection: IMAPConnectionInterface;
  private ongoingTimeout: NodeJS.Timer;
  private db: any;

  constructor(db: any) {
    super();
    this.db = db;
  }

  /**
   * Connects to the imap server.
   */
  public connect(imapConnection: IMAPConnectionInterface, interval?: number): void {
    this.imapConnection = imapConnection;
    this.interval = interval || 60000;

    this.imapConnection.on(IMAPConnectionEvent.READY, this.handleInitialConnect.bind(this));
    this.imapConnection.on(IMAPConnectionEvent.ERROR, this.handleConnectionError.bind(this));
    this.imapConnection.on(IMAPConnectionEvent.UNAUTH, this.handleConnectionAuth.bind(this));
    this.imapConnection.on(IMAPConnectionEvent.MAIL, this.handleNewMailEvent.bind(this));
    this.imapConnection.on(IMAPConnectionEvent.CHANGE, this.handleServerChange.bind(this));
    this.imapConnection.on(IMAPConnectionEvent.SERVER, this.handleServerMessage.bind(this));
    process.on('exit', this.handleCleanup.bind(this));

    this.imapConnection.updateCredentials();
  }

  /**
   * Disconnects.
   */
  public disconnect() {
    this.handleCleanup();
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
    this.getType(mail)
    .then((mailType) => {
      let formattedMessage;

      if (mailType === IncomingMailEvent.TICKET || mailType === IncomingMailEvent.FORWARD) {
        formattedMessage = this.formatAsNewTicket(mail);
      } else {
        formattedMessage = this.formatAsAnswer(mail);
      }

      this.emitMessage(formattedMessage, mailType);

      if (this.ongoingTimeout) {
        clearTimeout(this.ongoingTimeout);
      }
      this.ongoingTimeout = setTimeout(() => { this.getUnreadEmails(); }, this.interval);
    });
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
  private getType(mail: IReceivedEmail): Promise<string> {
    return new Promise((resolve, reject) => {
      let type;

      this.isInWhitelist(Array.isArray(mail.from) ? mail.from[0].address : mail.from.address)
      .then((isWhitelisted) => {
        if (isWhitelisted && this.isNewTicket(mail)) {
          type = IncomingMailEvent.TICKET;
        } else if (isWhitelisted) {
          type = IncomingMailEvent.ANSWER;
        } else {
          type = IncomingMailEvent.FORWARD;
        }

        resolve(type);
      });
    });
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

    message.status = 0;
    message.assignee = null;

    message.mailId = mail.messageId;
    message.created = mail.receivedDate;
    message.title = mail.subject;
    message.from = {
      name: Array.isArray(mail.from) ? mail.from[0].name : mail.from.name,
      email: Array.isArray(mail.from) ? mail.from[0].address : mail.from.address
    };
    message.body = [
      {
        received: mail.receivedDate,
        body: mail.text,
        fromCustomer: true,
        fromName: Array.isArray(mail.from)
                        ? (mail.from[0].name || mail.from[0].address)
                        : (mail.from.name || mail.from.address)
      }
    ];

    return message;
  }

  /**
   * Formats as an answer.
   */
  private formatAsAnswer(mail: IReceivedEmail): IReceivedAnswer {
    const message = ({} as IReceivedAnswer);

    if (mail.html) {
      const dom = new JSDOM().window.document;
      message.body =  h2p(planer.extractFrom(mail.html, 'text/html', dom));
    } else {
      const replyString = /[\r\n]+^(On\s(\n|.)*wrote(.*)$)/m;
      const replyStringSwe = /[\r\n]+^(Den\s(\n|.)*skrev(.*)$)/m;
      const replyStringDate = /[\r\n]+^([0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))\s(([0-1][0-9]|[2][0-3]):([0-5][0-9]))\s(GMT+))/m;
      const rexexps = [
        replyString,
        replyStringSwe,
        replyStringDate
      ];

      const mildlyParsed = planer.extractFrom(mail.text, 'text/plain');
      let text = mildlyParsed;

      rexexps.forEach((exp) => {
        const match = exp.exec(mildlyParsed);

        if (match) {
          const index = mildlyParsed.indexOf(match[0]);
          text = mildlyParsed.substring(0, index);
        }
      });

      message.body = text;
    }

    message.mailId = mail.messageId;
    message.inAnswerTo = Array.isArray(mail.references) ? mail.references[0] : mail.references;
    message.received = mail.receivedDate;
    message.fromName = Array.isArray(mail.from)
                        ? (mail.from[0].name || mail.from[0].address)
                        : (mail.from.name || mail.from.address);

    return message;
  }

  /**
   * Checks if the sender is in the whitelist.
   */
  private isInWhitelist(address: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let found = false;

      this.db.getAll('customer', {})
      .then((customers) => {
        const whitelist = customers.map((customer) => customer.email);

        whitelist.forEach((approved) => {
          if (address.indexOf(approved) !== -1) {
            resolve(found = true);
          }
        });

        resolve(found);
      })
      .catch((error) => {
        this.handleConnectionError(new DBError('Something wrong with the whitelist.'));
      });
    });
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
    this.emit(IncomingMailEvent.ERROR, new IMAPError(err) || new IMAPError('Something wrong with the connection.'));
  }

  /**
   * Emits unauth errors.
   */
  private handleConnectionAuth(): void {
    this.emit(IncomingMailEvent.UNAUTH, {message: 'User credentails are missing.'});
  }

  /**
   * Emits that the server has sent a message.
   */
  private handleServerMessage(payload: object): void {
    this.emit(IncomingMailEvent.MESSAGE, payload);
  }

  /**
   * Emits that the server has changed.
   */
  private handleServerChange(payload: object): void {
    this.emit(IncomingMailEvent.TAMPER, payload);
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
export default MailReciever;
