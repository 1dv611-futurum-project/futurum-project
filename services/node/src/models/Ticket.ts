/**
 * Mongoose Schema Ticket Model.
 */

import { Document, Schema, Model, model} from 'mongoose';
import { ITicket } from './interfaces/ITicket';
import Message from './Message';

export interface ITicketModel extends ITicket, Document {}

 // Todo: change Date to DateTime type
const TicketSchema: Schema = new Schema({
  recieved: {type: Date, required: true},
  title: {type: String, required: true},
  from: {type: String, required: true},
  body: {type: Message[], required: true}
});

export default model<ITicketModel>('Ticket', TicketSchema);
