/**
 * Mongoose Schema Customer Model.
 */

import { Document, Schema, Model, model} from 'mongoose';
import ICustomer from './../interfaces/ICustomer';

export interface ICustomerModel extends ICustomer, Document {}

const CustomerSchema: Schema = new Schema({
  email: {type: Array, required: true, unique: true},
  name: {type: String, required: false},
  errands: {type: Number, requires: false}
});

export default model('Customer', CustomerSchema);
