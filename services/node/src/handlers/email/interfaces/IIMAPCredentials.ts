/**
 * IMAP Credentials interface for communicating with the XOauth module.
 */

// Exports.
export default interface IIMAPCredentials {
  user: string;
  accessToken: string;
  refreshToken: string;
  clientID: string;
  clientSecret: string;
}
