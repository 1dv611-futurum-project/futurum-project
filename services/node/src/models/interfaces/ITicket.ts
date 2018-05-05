import Mail from '../Mail';

export interface ITicket {
  ticketId?: number;
  mailId: string;
  status?: number;
  assignee?: string;
  title?: string;
  from?: string;
  customerName?: string;
  created?: Date;
  body?: Mail[];
}
