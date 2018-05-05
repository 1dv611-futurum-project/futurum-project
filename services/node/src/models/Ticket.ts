/**
 * Mongoose Schema Ticket Model.
 */
import { Document, Schema, Model, model} from 'mongoose';
import * as autoIncrement from 'mongoose-auto-increment';
import * as mongoose from 'mongoose';
import { ITicket } from './interfaces/ITicket';

export interface ITicketModel extends ITicket, Document {}

autoIncrement.initialize(mongoose.connection);

const TicketSchema: Schema = new Schema({
  mailId: {type: String, required: true},
  status: {type: Number, default: 0},
  assignee: {type: Object, required: false},
  title: {type: String, required: false},
  from: {type: Object, required: true},
  customerName: {type: String, required: false},
  created: {type: Date, required: true},
  body: {type: [], required: true}
});

TicketSchema.plugin(autoIncrement.plugin, { model: 'Ticket', field: 'ticketId', startAt: 100 });

export default model<ITicketModel>('Ticket', TicketSchema);
