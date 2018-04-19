import { IMessage } from './IMessage';

export interface ITicket {
  recieved?: Date;
  title?: string;
  from?: string;
  body?: IMessage[];
}
