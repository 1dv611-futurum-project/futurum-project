/**
 * Mongoose Schema Assignee Model.
 */

import { Document, Schema, Model, model} from 'mongoose';
import { IAssignee } from './interfaces/IAssignee';

export interface IAssigneeModel extends IAssignee, Document {}

const AssigneeSchema: Schema = new Schema({
  email: {type: Array, required: true},
  name: {type: String, required: true}
});

export default model('Assignee', AssigneeSchema);
