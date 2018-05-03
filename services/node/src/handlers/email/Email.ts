import IEmail from './interfaces/IEmail';

export default class Email implements IEmail {

  public from: string;
  public to: string;
  public subject: string;
  public body: string;

  constructor(email: object) {
    this.from = email.from;
    this.to = email.to;
    this.subject = email.subject;
    this.body = email.body;
  }
}