/**
 * Module to handle the outgoing and incoming email connections.
 */

// Imports.
import IMAPConnection from './IMAPConnection';
import IMAPHandler from './IMAPHandler';
import MailSender from './MailSender';

/**
 * Wraps incomping and outgoing email handlers.
 */
class EmailHandler {
  private IMAPConnection: IMAPConnection;
  private IMAPHandler: IMAPHandler;
  private MailSender: MailSender;

  /**
   * Returns a handler of incoming mails.
   */
  get Incoming(): IMAPHandler {
    return this.IMAPHandler;
  }

  /**
   * Returns a handler to send mails.
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
   * Runs an update of the IMAP-connection
   * in case new credentials has been added.
   */
  public updateIMAPConnection() {
    this.IMAPHandler.connect(this.IMAPConnection);
  }
}

// Exports.
export default new EmailHandler();
