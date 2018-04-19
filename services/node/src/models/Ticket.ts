/**
 * Mongoose Schema Ticket Model.
 */

import { Document, Schema, Model, model} from 'mongoose';
import { ITicket } from './interfaces/ITicket';

export interface ITicketModel extends ITicket, Document {}

 // Todo: change Date to DateTime type
let Message: object = {
  recieved: {type: Date, required: true},
  fromCustomer: {type: Boolean, required: true},
  body: {type: String, required: true}
};

const TicketSchema: Schema = new Schema({
  recieved: {type: Date, required: true},
  title: {type: String, required: true},
  from: {type: String, required: true},
  body: {type: Message[], required: true}
});

export default model<ITicketModel>('Ticket', TicketSchema);
