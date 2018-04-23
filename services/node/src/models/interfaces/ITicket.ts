import Mail from '../Mail';

export interface ITicket {
  status?: number;
  assignee?: string;
  title?: string;
  from?: string;
  customerName?: string;
  body?: Mail[];
}
