/**
 * Module to handle the outgoing and incoming email connections.
 */

// Imports.
import Connection from './IMAPConnection';
import { IMAPConnection } from './IMAPConnection';
import IMAPHandler from './IMAPHandler';
import { IMAPConnectionHandler } from './IMAPHandler';
import MailSender from './MailSender';
import { GmailSender } from './MailSender';

/**
 * Wraps incomping and outgoing email handlers.
 */
class EmailHandler {
  private IMAPConnection: IMAPConnection;
  private IMAPHandler: IMAPConnectionHandler;
  public MailSender: GmailSender;

  /**
   * Returns a handler of incoming mails.
   */
  get Incoming(): IMAPConnectionHandler {
    return this.IMAPHandler;
  }

  /**
   * Returns a handler to send mails.
   */
  get Outgoing(): GmailSender {
    return this.MailSender;
  }

  constructor() {
    this.IMAPHandler = IMAPHandler;
    this.IMAPConnection = Connection;
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
export type MailWrapper = EmailHandler;
