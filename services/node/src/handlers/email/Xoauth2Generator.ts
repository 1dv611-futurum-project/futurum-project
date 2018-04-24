/**
 * Creates and refreshes the xoauth-tokens needed for the imap connaction.
 */

// Imports
import * as xoauth2 from 'xoauth2';
import IIMAPCredentials from './interfaces/IIMAPCredentials';
import { NoIMAPCredentialsError } from './../../config/errors';

/**
 * Instantiates an xoauth generator
 * using environment variables.
 * Needs environment variables to exist
 * names IMAP_CLIENT_ID, IMAP_CLIENT_SECRET
 * IMAP_ACCESS_TOKEN, IMAP_REFRESH_TOKEN, IMAP_USER.
 */
class XOauth {

  private xoauth2gen;
  private options;

  constructor() {
    this.updateGenerator();
  }

  /**
   * Updates the generator if new access- or refresh-tokens
   * has been sat in the environment variables.
   */
  public updateGenerator(): void {
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
      if (this.xoauth2gen) {
        this.xoauth2gen.getToken((err, token) => {
          if (err) {
            reject(err);
          }
          resolve(token);
        });
      } else {
        reject(new NoIMAPCredentialsError('No generator'));
      }
    });
  }

  /**
   * Checks that the correct credentials are set as environment variables and
   * returns them in an object, otherwise
   * emits unauth-error.
   */
  private getCredentials(): IIMAPCredentials {
    if (process.env.IMAP_USER
        && process.env.IMAP_CLIENT_ID
        && process.env.IMAP_CLIENT_SECRET
        && process.env.IMAP_ACCESS_TOKEN
        && process.env.IMAP_REFRESH_TOKEN) {
      const credentials = ({} as IIMAPCredentials);
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
  private getGenerator() {
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
export type Xoauth2Generator = XOauth;
