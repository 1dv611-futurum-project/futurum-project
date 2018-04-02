/**
 * Handles the connection against the email server.
 */

// Imports
import * as Imap from 'imap';

class IMAPHandler {

  private imap : Imap

  constructor() {
    const password = process.env.IMAP_PASSWORD
    const user = process.env.IMAP_USER

    this.imap = new Imap({
      user: user,
      password: password,
      host: 'imap.gmail.com',
      port: 993,
      tls: true
    });

    this.imap.once('ready', this.collectUnreadAndSetUpListeners)
    this.imap.once('error', this.handleConnectionError);
    this.imap.once('end', this.handleConnectionEnd);

    this.imap.connect()
  }

  private collectUnreadAndSetUpListeners(): void {
    console.log('Collecting unread and setting up listeners')
  }

  private handleConnectionError(err): void {
    console.log('Got connection error')
    console.log(err);
  }

  private handleConnectionEnd(): void {
    console.log('Connection ended');
  }
}

// Exports.
export default IMAPHandler;
