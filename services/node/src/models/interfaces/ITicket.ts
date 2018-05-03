import Mail from '../Mail';

export interface ITicket {
  ticketId: number;
  status?: number;
  assignee?: string;
  title?: string;
  from?: string;
  customerName?: string;
  body?: Mail[];
}
