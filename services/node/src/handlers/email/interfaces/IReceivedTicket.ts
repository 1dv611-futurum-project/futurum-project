/**
 * Recieved ticket interface for communicating with the IMAP modules.
 */

// Exports.
export default interface IReceivedTicket {
	assignee: any;
	status: number;
	mailId: string;
	replyId?: string[];
	created: string;
	title: string;
	from: ICustomer;
	isRead: boolean;
	body: IMail[];
}

interface ICustomer {
	name: string;
	email: string;
}

interface IMail {
	received: string;
	body: string;
	fromName: string;
}
