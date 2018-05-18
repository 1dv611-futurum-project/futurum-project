/**
 * Mongoose Schema Customer Model.
 */

// Imports
import { Document, Schema, Model, model} from 'mongoose';
import ICustomer from './../interfaces/ICustomer';

// Schema
const CustomerSchema: Schema = new Schema({
	email: {type: Array, required: true, unique: true},
	name: {type: String, required: false},
	errands: {type: Number, requires: false}
});

// Exports
export interface ICustomerModel extends ICustomer, Document {}
export default model('Customer', CustomerSchema);
