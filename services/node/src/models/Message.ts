
import { IMessage } from './interfaces/IMessage';

/**
 * Message class.
 */
class Message implements IMessage {
 // Todo: change Date to DateTime type
  public received: Date;
  public body: string;
  public fromCustomer: boolean;

  constructor(message: object) {
    this.received = message.received;
    this.fromCustomer = message.fromCustomer;
    this.body = message.body;
  }
}

export default Message;
