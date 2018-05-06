/**
 * Assignee interface.
 */

 // Imports
import { Schema } from 'mongoose';

export default interface IAssignee {
  _id: Schema.Types.ObjectId;
  email?: string;
  name?: string;
}
