/**
 * Acts as a wrapper for the googleapi to send mails.
 */

// Imports
import * as events from 'events';
import { google } from 'googleapis';
import IEmail from './IEmail';
const OAuth2 = google.auth.OAuth2;

class MailSender extends events.EventEmitter {

  private oauth2Client;
  private credentials;

  /**
   * Creates OAuth client to authenticate against gmail.
   */
  constructor() {
    super();

    this.oauth2Client = new OAuth2(
      process.env.IMAP_CLIENT_ID,
      process.env.IMAP_CLIENT_SECRET,
      process.env.IMAP__REDIRECT_URL
    );
  }

  /**
   * Sends an email with the given body and
   * subject to the given address.
   * @param params {IEmail} an IEmail object with the params to populate the email with.
   */
  public send(params: IEmail): Promise<void> {
    const headers = this.getNewEmailHeaders(params);
    return this.sendMail(headers);
  }

  /**
   * Answers a message with the given messageID.
   * @param params {IEmail} an IEmail object with the params to populate the answer with.
   * @param messageID {string} the messageID of the email to answer.
   */
  public answer(params: IEmail, messageID: string): Promise<void> {
    const headers = this.getReplyHeaders(params, messageID);
    return this.sendMail(headers);
  }

  public forward() {
    // TODO
  }

  /**
   * Sends an email through the gmail api.
   * @param headers {string[]} The headers to send.
   */
  private sendMail(headers: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.updateCredentials()
      .then(() => {
        const gmail = google.gmail('v1');
        const base64Email = this.getBase64EncodedEmailFromHeaders(headers);

        const request = {
          auth: this.oauth2Client,
          userId: 'me',
          resource: {
            raw: base64Email
          }
        };

        gmail.users.messages.send(request, null, (err, response) => {
          if (!err) {
            return resolve();
          } else {
            return reject({message: 'Unable to send email: ' + err});
          }
        });
      })
      .catch((error) => {
        reject(error);
      });
    });
  }

  /**
   * Gets the headers for a new email.
   * @param params {IEmail} an IEmail object with the params to populate the headers with.
   */
  private getNewEmailHeaders(params: IEmail): string[] {
    let headers = this.getBaseHeaders(params.to, params.from);
    headers.push('Subject: ' + params.subject);
    headers = headers.concat(this.getBody(params.body));
    return headers;
  }

  /**
   * Gets the headers for an email reply.
   * @param params {IEmail} an IEmail object with the params to populate the headers with.
   */
  private getReplyHeaders(params: IEmail, messageID): string[] {
    let headers = this.getBaseHeaders(params.to, params.from);
    headers.push('Subject: Re: ' + params.subject);
    headers.push('In-Reply-To: <' + messageID + '>');
    console.log(params.body);
    headers = headers.concat(this.getBody(params.body));
    console.log(headers);
    return headers;
  }

  /**
   * Gets the basic headers.
   * @param to {string} The email address to send the email to.
   * @param from {string} Optional "from"-header.
   */
  private getBaseHeaders(to: string, from?: string): string[] {
    const headers = [];
    headers.push('From: <' + (from || process.env.IMAP_USER) + '>');
    headers.push('To: ' + to);
    headers.push('Content-type: text/html;charset=iso-8859-1');
    headers.push('MIME-Version: 1.0');

    return headers;
  }

  /**
   * Gets the email body.
   * @param body {string} The desired body of the email.
   */
  private getBody(body: string): string[] {
    const headers = [];
    headers.push('');
    headers.push(body);

    return headers;
  }

  /**
   * Base64-Encodes the email.
   * @param headers {string[]} The headers to encode.
   */
  private getBase64EncodedEmailFromHeaders(headers: string[]): Buffer {
    const email = headers.join('\r\n').trim();
    let base64EncodedEmail = new Buffer(email).toString('base64');
    base64EncodedEmail = base64EncodedEmail.replace(/\+/g, '-').replace(/\//g, '_');

    return base64EncodedEmail;
  }

  /**
   * Updates the oauth2 cretentials if a new authentication has
   * been made against google.
   */
  private updateCredentials(): Promise<void> {
    return new Promise((resolve, reject) => {
      const newCredentials = {
        access_token: process.env.IMAP_ACCESS_TOKEN,
        refresh_token: process.env.IMAP_REFRESH_TOKEN
      };

      if (newCredentials
         && (!this.credentials
         || (this.credentials
            && (this.credentials.access_token !== newCredentials.access_token
                || this.credentials.refresh_token !== newCredentials.refresh_token)))) {
        this.credentials = newCredentials;

        this.oauth2Client.setCredentials(this.credentials);
      }

      resolve();
    });
  }
}

// Exports
export default new MailSender();
