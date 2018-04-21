
import { IMessage } from './interfaces/IMessage';

/**
 * Message class.
 */
class Message implements IMessage {
 // Todo: change Date to DateTime type
  public recieved: Date;
  public body: string;
  public fromCustomer: boolean;

  constructor(message: object) {
    this.recieved = message.recieved;
    this.fromCustomer = message.fromCustomer;
    this.body = message.body;
  }
}

export default Message;
