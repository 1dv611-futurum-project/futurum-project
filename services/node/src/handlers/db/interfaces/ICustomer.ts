/**
 * Customer interface.
 */

// Imports
import { Schema } from 'mongoose';

export default interface ICustomer {
  errands?: number;
  email?: string[];
  name: string;
}
