/**
 * Module to handle the outgoing and incoming email connections.
 */

// Imports.
import IMAPConnection from './IMAPConnection';
import IMAPHandler from './IMAPHandler';
import MailSender from './MailSender';

class EmailHandler {
  private IMAPConnection: IMAPConnection;
  private IMAPHandler: IMAPHandler;
  private MailSender: MailSender;

  /**
   * Returns the incoming mailhandler.
   */
  get Incoming(): IMAPHandler {
    return this.IMAPHandler;
  }

  /**
   * Returns the outgoing mailhandler.
   */
  get Outgoing(): MailSender {
    return this.MailSender;
  }

  constructor() {
    this.IMAPHandler = IMAPHandler;
    this.IMAPConnection = IMAPConnection;
    this.MailSender = MailSender;
  }

  /**
   * Updates the IMAP-connection.
   */
  public updateIMAPConnection() {
    this.IMAPHandler.connect(this.IMAPConnection);
  }
}

// Exports.
export default new EmailHandler();
