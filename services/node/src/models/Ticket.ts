/**
 * Mongoose Schema Ticket Model.
 */
import { Document, Schema, Model, model} from 'mongoose';
import { ITicket } from './interfaces/ITicket';

export interface ITicketModel extends ITicket, Document {}

 // Todo: change Date to DateTime type
const TicketSchema: Schema = new Schema({
  status: {type: String, default: 'Ej påbörjad'},
  assignee: {type: String, required: false},
  title: {type: String, required: false},
  from: {type: String, required: true},
  name: {type: String, required: false},
  body: {type: [], required: true}
});

export default model<ITicketModel>('Ticket', TicketSchema);
