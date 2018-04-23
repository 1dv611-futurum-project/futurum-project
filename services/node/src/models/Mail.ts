
import { IMail } from './interfaces/IMail';

/**
 * Mail class.
 */
class Mail implements IMail {
 // Todo: change Date to DateTime type
  public received: Date;
  public body: string;
  public fromCustomer: boolean;

  constructor(mail: object) {
    this.received = mail.received;
    this.fromCustomer = mail.fromCustomer;
    this.body = mail.body;
  }
}

export default Mail;
