/**
 * Interface for the messages
 */

// Exports
export default interface IMail {
	received?: Date;
	body?: string;
	fromName?: string;
}
