/**
 * Recieved email interface for communicating with the IMAP modules.
 */

// Exports.
export default interface IReceivedEmail {
	from: ICustomer;
	references?: string;
	messageId: string;
	receivedDate: string;
	subject: string;
	text: string;
	html?: string;
}

// Local interfaces
interface ICustomer {
	name: string;
	address: string;
}
