import Mail from '../Mail';

export interface ITicket {
  ticketId?: number;
  mailId: string;
  status?: number;
  assignee?: object;
  title?: string;
  from?: object;
  created?: Date;
  body?: Mail[];
}
