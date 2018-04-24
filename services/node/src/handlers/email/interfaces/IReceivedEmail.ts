/**
 * Recieved email interface for communicating with the IMAP modules.
 */

// Exports.
export default interface IReceivedEmail {
  from?: string;
  to?: string;
  subject: string;
  body: string;
}
