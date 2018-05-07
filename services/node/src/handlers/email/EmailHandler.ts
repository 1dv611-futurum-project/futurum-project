/**
 * Module to handle the outgoing and incoming email connections.
 */

// Imports.
import Connection from './tools/IMAPConnection';
import { IMAPConnection } from './tools/IMAPConnection';
import MailReciever from './tools/MailReciever';
import MailSender from './tools/MailSender';
import { GmailSender } from './tools/MailSender';

/**
 * Wraps incomping and outgoing email handlers.
 */
class EmailHandler {
  private IMAPConnection: IMAPConnection;
  private MailReciever: MailReciever;
  public MailSender: GmailSender;

  private db: any;

  /**
   * Returns a handler of incoming mails.
   */
  get Incoming(): MailReciever {
    return this.MailReciever;
  }

  /**
   * Returns a handler to send mails.
   */
  get Outgoing(): GmailSender {
    return this.MailSender;
  }

  constructor(db: any) {
    this.db = db;
    this.MailReciever = new MailReciever(this.db);
    this.IMAPConnection = Connection;
    this.MailSender = MailSender;
  }

  /**
   * Runs an update of the IMAP-connection
   * in case new credentials has been added.
   */
  public updateIMAPConnection() {
    this.MailReciever.connect(this.IMAPConnection);
  }
}

// Exports.
export default EmailHandler;
