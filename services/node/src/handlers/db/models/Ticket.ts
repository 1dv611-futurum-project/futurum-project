/**
 * Mongoose Schema Ticket Model.
 */

 // Imports
import { Document, Schema, Model, model} from 'mongoose';
import * as autoIncrement from 'mongoose-auto-increment';
import * as mongoose from 'mongoose';
import ITicket from './../interfaces/ITicket';

autoIncrement.initialize(mongoose.connection);

// Schema
const TicketSchema: Schema = new Schema({
	mailId: {type: String, required: true},
	replyId: {type: [String], required: false, default: []},
	status: {type: Number, default: 0},
	assignee: { type: Schema.Types.ObjectId, ref: 'Assignee', required: false },
	title: {type: String, required: false},
	from: { type: Schema.Types.ObjectId, ref: 'Customer' },
	created: {type: Date, required: true},
	isRead: {type: Boolean, required: true, default: false},
	body: {type: [], default: []}
});

TicketSchema.plugin(autoIncrement.plugin, { model: 'Ticket', field: 'ticketId', startAt: 100 });

// Exports
export interface ITicketModel extends ITicket, Document {}
export default model<ITicketModel>('Ticket', TicketSchema);
