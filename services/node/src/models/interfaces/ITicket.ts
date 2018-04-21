import Message from '../Message';

export interface ITicket {
  status?: string;
  assignee?: string;
  title?: string;
  from?: string;
  name?: string;
  body?: Message[];
}
