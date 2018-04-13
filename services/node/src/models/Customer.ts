/**
 * Mongoose Schema Customer Model.
 */

import { Document, Schema, Model, model} from 'mongoose';

const CustomerSchema: Schema = new Schema({
  email: {type: String, required: true},
  name: {type: String, required: true}
});

export default model('Customer', CustomerSchema);
