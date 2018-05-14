/**
 * TicketChannel class for handling Socket ticket events
 * @module handlers/socket/channels/SettingChannel
 */
import * as SocketIO from 'socket.io-client';

import { Channel } from './Channel';
import { TicketEvent } from '../models/TicketEvent';

/**
 * TicketChannel class
 */
export default class TicketChannel extends Channel {

	public channel = TicketEvent.CHANNEL;

	/**
	 * Listen for new tickets
	 * @public
	 * @param {Any} cb - A callback function
	 */
	public onTickets(cb: any) {
		this.listen(cb);
	}

	/**
	 * Emits a status change event to channel
	 * @public
	 * @param {Object} ticket - A ticket object
	 */
	public emitStatus(ticket: object) {
		this.emit(TicketEvent.STATUS, ticket);
	}

	/**
	 * Emits an assignee change event to channel
	 * @public
	 * @param {Object} ticket - A ticket object
	 */
	public emitAssignee(ticket: object) {
		this.emit(TicketEvent.ASSIGNEE, ticket);
	}

	/**
	 * Emits an message event to channel
	 * @public
	 * @param {Object} ticket - A ticket object
	 */
	public emitMessage(ticket: object) {
		this.emit(TicketEvent.MESSAGE, ticket);
	}

	/**
	 * Emits an isRead event when the ticket has been visited
	 * @public
	 * @param {Object} ticket - A ticket object
	 */
	public emitRead(ticket: object) {
		this.emit(TicketEvent.READ, ticket);
	}
}
