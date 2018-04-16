/**
 * Mongoose Schema Ticket Model.
 */

import { Document, Schema, Model, model} from 'mongoose';
import { ITicket } from './interfaces/ITicket';

export interface ITicketModel extends ITicket, Document {}

const TicketSchema: Schema = new Schema({
  recieved: {type: Date, required: true},
  title: {type: String, required: true},
  from: {type: String, required: true},
  body: {type: String, required: true}
});

export default model<ITicketModel>('Ticket', TicketSchema);
