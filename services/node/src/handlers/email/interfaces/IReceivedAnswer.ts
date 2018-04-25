/**
 * Received answer interface for communicating with the IMAP modules.
 */

// Exports.
export default interface IReceivedAnswer {
  mailID: string;
  inAnswerTo: string;
  received: string;
  body: string;
  fromCustomer: boolean;
}
