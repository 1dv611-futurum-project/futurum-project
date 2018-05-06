/**
 * Recieved ticket interface for communicating with the IMAP modules.
 */

// Exports.
export default interface IReceivedTicket {
  assignee: any;
  status: number;
  mailId: string;
  created: string;
  title: string;
  from: ICustomer;
  body: IMessage[];
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
