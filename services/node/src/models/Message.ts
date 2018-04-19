/**
 * Message class.
 */
class Message {
 // Todo: change Date to DateTime type
  private recieved: Date;
  private fromCustomer: boolean;
  private body: string;

  constructor(recieved: Date, fromCustomer: boolean, body: string) {
    this.recieved = recieved;
    this.fromCustomer = fromCustomer;
    this.body = body;
  }
}

export default Message;
