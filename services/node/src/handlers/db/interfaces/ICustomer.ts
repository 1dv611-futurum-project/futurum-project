/**
 * Customer interface.
 */

// Imports
import { Schema } from 'mongoose';

// Exports
export default interface ICustomer {
	errands?: number;
	email?: string[];
	name: string;
}
