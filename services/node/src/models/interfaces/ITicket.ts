import Mail from '../Mail';

export interface ITicket {
  ticketId?: number;
  mailId: string;
  status?: number;
  assignee?: string;
  title?: string;
  from?: object;
  created?: Date;
  body?: Mail[];
}
