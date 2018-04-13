/**
 * Creates and refreshes the xoauth-tokens needed for the imap connaction.
 */

// Imports
import * as xoauth2 from 'xoauth2';

/**
 * Instantiation takes an options object containing:
 * user: {the email address},
 * clientID: {the client id},
 * clientSecret: {the client secret},
 * refreshToken: {the refresh token},
 * accessToken: {the access token}
 */
class XOauth {

  private xoauth2gen;

  constructor(options: object) {
    this.xoauth2gen = xoauth2.createXOAuth2Generator({
      user: options.user,
      clientId: options.clientID,
      clientSecret: options.clientSecret,
      accessToken: options.accessToken,
      refreshToken: options.refreshToken
    });
  }

  /**
   * Returns a Promise that resolves with an xoauth-token.
   */
  public getToken(): Promise {
    return new Promise((resolve, reject) => {
      this.xoauth2gen.getToken((err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      });
    });
  }
}

// Exports.
export default XOauth;
