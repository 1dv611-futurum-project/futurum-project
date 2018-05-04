/**
 * Mongoose Schema Customer Model.
 */

import { Document, Schema, Model, model} from 'mongoose';
import { ICustomer } from './interfaces/ICustomer';

export interface ICustomerModel extends ICustomer, Document {}

const CustomerSchema: Schema = new Schema({
  email: {type: Array, required: true},
  name: {type: String, required: false}
});

export default model('Customer', CustomerSchema);
