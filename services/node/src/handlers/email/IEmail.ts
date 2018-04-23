/**
 * Email interface for communicating with the email module.
 */

// Exports.
export default interface IEmail {
  from?: string;
  to?: string;
  subject: string;
  body: string;
}
