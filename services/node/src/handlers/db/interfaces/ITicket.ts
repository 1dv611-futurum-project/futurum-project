/**
 * Ticket interface.
 */

// Imports
import IMail from './IMail';

// Exports
export default interface ITicket {
	ticketId?: number;
	mailId: string;
	replyId: string[];
	status?: number;
	assignee?: string;
	title?: string;
	from?: string;
	created?: Date;
	isRead: boolean;
	body?: IMail[];
}
