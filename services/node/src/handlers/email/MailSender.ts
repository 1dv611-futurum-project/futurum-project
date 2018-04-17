/**
 * Acts as a wrapper for the googleapi to send mails.
 */

// Imports
import * as events from 'events';
import { google } from 'googleapis';
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
   */
  public send(params: object): Promise<void> {
    return new Promise((resolve, reject) => {
      this.updateCredentials()
      .then(() => {
        let gmail = google.gmail('v1');
        let headers = this.getHeaders(params);
        let base64Email = this.getBase64EncodedEmailFromHeaders(headers);

        let request = {
          auth: this.oauth2Client,
          userId: 'me',
          resource: {
              raw: base64Email
          }
        };

        gmail.users.messages.send(request, null, (err, response) => {
          if (!err) {
              return resolve(response);
          }
          else {
              return reject({message: 'Unable to send email: ' + err});
          }
        });
      })
      .catch((error) => {
        reject(error);
      })
    })
  }

  public answer(messageID, params) {
    return new Promise((resolve, reject) => {
      this.updateCredentials()
      .then(() => {
        let gmail = google.gmail('v1');
        let headers = this.getHeaders(params);
        headers = this.getReplyHeaders(headers, messageID);
        let base64Email = this.getBase64EncodedEmailFromHeaders(headers);

        let request = {
          auth: this.oauth2Client,
          userId: 'me',
          resource: {
              raw: base64Email
          }
        };

        gmail.users.messages.send(request, null, (err, response) => {
          if (!err) {
              return resolve(response);
          }
          else {
              return reject({message: 'Unable to send email: ' + err});
          }
        });
      })
      .catch((error) => {
        reject(error);
      })
    })
  }

  public forward() {
    //TODO
  }

  /**
   * Sets the email-parameters.
   */
  private getHeaders(params: object): string[] {
    let headers =[];
    headers.push('From: <' + params.from + '>');
    headers.push('To: ' + params.to);
    headers.push('Content-type: text/html;charset=iso-8859-1');
    headers.push('MIME-Version: 1.0');
    headers.push('Subject: ' + params.subject);
    headers.push('');
    headers.push(params.body);

    return headers;
  }

  /**
   * Sets the reply-parameters.
   */
  private getReplyHeaders(headers: string[], messageID): string[] {
    headers.push('in-reply-to: <' + messageID + '>');
    headers.push('References: <' + messageID + '>');

    return headers;
  }

  /**
   * Encodes the email.
   */
  private getBase64EncodedEmailFromHeaders(headers: string[]): Buffer {
    let email = headers.join('\r\n').trim();
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
      let newCredentials = {
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
    })
  }
}

// Exports
export default new MailSender();
