/**
 * Acts as a wrapper for the googleapi to send mails.
 */

// Imports
import * as events from 'events';
import * as gmailApiSync from 'gmail-api-sync';
import * as google from 'googleapis';
import XOauth from './Xoauth2Generator';

class MailSender extends events.EventEmitter {

  private xoauthgenerator: XOauth;

  constructor(generator: XOauth) {
    super();
    this.xoauthgenerator = generator;
  }

  public send(params: object): Promise<void> {
    return new Promise((resolve, reject) => {
      this.xoauthgenerator.getToken()
      .then((token) => {
        let gmail = google.gmail('v1');
        let headers = this.getHeaders(params);
        let base64Email = this.getBase64EncodedEmailFromHeaders(headers);

        let request = {
          auth: token,
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
        console.log(error);
        reject(error);
      })
    })
  }

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

  private getBase64EncodedEmailFromHeaders(headers: string[]): Buffer {
    let email = headers.join('\r\n').trim();
    let base64EncodedEmail = new Buffer(email).toString('base64');
        base64EncodedEmail = base64EncodedEmail.replace(/\+/g, '-').replace(/\//g, '_');

    return base64EncodedEmail;
  }
}

// Exports
export default MailSender;
