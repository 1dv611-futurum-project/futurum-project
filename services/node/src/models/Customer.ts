/**
 * Mongoose Schema Customer Model.
 */

import { Document, Schema, Model, model} from 'mongoose';
import { ICustomer } from './interfaces/ICustomer';

export interface ICustomerModel extends ICustomer, Document {}

const CustomerSchema: Schema = new Schema({
  email: {type: String, required: true},
  name: {type: String, required: true}
});

export default model<ICustomerModel>('Customer', CustomerSchema);
