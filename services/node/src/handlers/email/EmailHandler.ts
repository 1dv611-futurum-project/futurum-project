import IMAPConnection from './IMAPConnection';
import IMAPHandler from './IMAPHandler';
import MailSender from './MailSender';

class EmailHandler {
  private IMAPConnection: IMAPConnection;
  private IMAPHandler: IMAPHandler;
  private MailSender: MailSender;

  get Incoming(): IMAPHandler {
    return this.IMAPHandler;
  }

  get Outgoing(): MailSender {
    return this.MailSender;
  }

  constructor() {
    this.IMAPHandler = IMAPHandler;
    this.IMAPConnection = IMAPConnection;
    this.MailSender = MailSender;
  }

  public updateIMAPConnection() {
    this.IMAPHandler.connect(this.IMAPConnection);
  }

  public sendMail(params: object): void {
    this.MailSender.send({
      from: process.env.IMAP_USER,
      to: params.to,
      subject: params.subject,
      body: params.body
    })
  }
}

export default new EmailHandler();
