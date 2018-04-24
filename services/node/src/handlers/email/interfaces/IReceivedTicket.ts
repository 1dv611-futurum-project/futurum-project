/**
 * Recieved ticket interface for communicating with the IMAP modules.
 */

// Exports.
export default interface IReceivedTicket {
  mailID: string;
  created: string;
  title: string;
  from: ICustomer;
  messages: IMessage[];
}

interface ICustomer {
  name: string;
  email: string;
}

interface IMessage {
  received: string;
  body: string;
  fromCustomer: boolean;
}
