import Message from '../Message';

export interface ITicket {
  status?: number;
  assignee?: string;
  title?: string;
  from?: string;
  customerName?: string;
  body?: Message[];
}
