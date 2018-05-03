/**
 * Mongoose Schema Ticket Model.
 */
import { Document, Schema, Model, model} from 'mongoose';
import { ITicket } from './interfaces/ITicket';

export interface ITicketModel extends ITicket, Document {}

 // Todo: change Date to DateTime type
const TicketSchema: Schema = new Schema({
  ticketId: {type: Number, required: true},
  status: {type: Number, default: 0},
  assignee: {type: String, required: false},
  title: {type: String, required: false},
  from: {type: String, required: true},
  customerName: {type: String, required: false},
  body: {type: [], required: true}
});

export default model<ITicketModel>('Ticket', TicketSchema);
