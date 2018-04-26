/**
 * Handles the websocket connection against the client.
 */

import * as SocketIO from 'socket.io-client';

import { Channel } from './Channel';
import { TicketEvent } from '../models/TicketEvent';

/**
 * Handles the connection.
 */
export default class TicketChannel extends Channel {

	public channel = TicketEvent.CHANNEL;

	public onTickets(cb: any) {
		this.listen(cb);
	}

	public emitStatus(ticket: object) {
		this.emit(TicketEvent.STATUS, ticket);
	}

	public emitAssignee(ticket: object) {
		this.emit(TicketEvent.ASSIGNEE, ticket);
	}

	public emitMessage(ticket: object) {
		this.emit(TicketEvent.MESSAGE, ticket);
	}
}
