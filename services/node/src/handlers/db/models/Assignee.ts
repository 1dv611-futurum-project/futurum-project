/**
 * Mongoose Schema Assignee Model.
 */

// Imports
import { Document, Schema, Model, model} from 'mongoose';
import IAssignee from './../interfaces/IAssignee';

// Schema
const AssigneeSchema: Schema = new Schema({
	email: {type: String, required: true},
	name: {type: String, required: true}
});

// Exports
export interface IAssigneeModel extends IAssignee, Document {}
export default model('Assignee', AssigneeSchema);
