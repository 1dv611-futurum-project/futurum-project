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
  private options;

  constructor() {
    this.updateGenerator();
  }

  public updateGenerator() {
    const newOptions = this.getCredentials();

    if (newOptions
       && (!this.options
       || (this.options
          && (this.options.accessToken !== newOptions.accessToken
              || this.options.refreshToken !== newOptions.refreshToken)))) {
      this.options = newOptions;
      this.xoauth2gen = this.getGenerator();
    }
  }

  /**
   * Returns a Promise that resolves with an xoauth-token.
   */
  public getToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.updateGenerator();
      this.xoauth2gen.getToken((err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      });
    });
  }

  /**
   * Checks that the correct credentials are set as environment variables and
   * returns them in an object, otherwise
   * emits unauth-error.
   */
  private getCredentials(): object {
    if (process.env.IMAP_USER
        && process.env.IMAP_CLIENT_ID
        && process.env.IMAP_CLIENT_SECRET
        && process.env.IMAP_ACCESS_TOKEN
        && process.env.IMAP_REFRESH_TOKEN) {
      const credentials = {};
      credentials.user = process.env.IMAP_USER;
      credentials.clientID = process.env.IMAP_CLIENT_ID;
      credentials.clientSecret = process.env.IMAP_CLIENT_SECRET;
      credentials.accessToken = process.env.IMAP_ACCESS_TOKEN;
      credentials.refreshToken = process.env.IMAP_REFRESH_TOKEN;
      return credentials;
    }

    return null;
  }

  /**
   * Sets the generator.
   */
  private getGenerator(): void {
    return xoauth2.createXOAuth2Generator({
      user: this.options.user,
      clientId: this.options.clientID,
      clientSecret: this.options.clientSecret,
      accessToken: this.options.accessToken,
      refreshToken: this.options.refreshToken
    });
  }
}

// Exports.
export default new XOauth();
