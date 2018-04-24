/**
 * Received answer interface for communicating with the IMAP modules.
 */

// Exports.
export default interface IReceivedAnswer {
  from?: string;
  to?: string;
  subject: string;
  body: string;
}
