/**
 * Customer interface.
 */

// Imports
import { Schema } from 'mongoose';

export default interface ICustomer {
  _id: Schema.Types.ObjectId;
  email?: string[];
  name: string;
}
