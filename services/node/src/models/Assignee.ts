/**
 * Mongoose Schema Assignee Model.
 */

import { Document, Schema, Model, model} from 'mongoose';

const AssigneeSchema: Schema = new Schema({
  email: {type: String, required: true},
  name: {type: String, required: true}
});

export default model('Assignee', AssigneeSchema);
