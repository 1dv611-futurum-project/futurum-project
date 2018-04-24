/**
 * Handles the websocket connection against the client.
 */

import * as SocketIO from 'socket.io-client';

/**
 * Handles the connection.
 */
export default class TicketChannel {

	private static TICKETS: string = 'tickets';
	private static TICKET: string = 'ticket';
	private static STATUS: string = 'ticket:status';
	private static ASSIGNEE: string = 'ticket:assignee';
	private static MAIL: string = 'ticket:mail';

	private io: SocketIOClient.Socket;

	constructor(io: SocketIOClient.Socket) {
		this.io = io;
	}

	public onAllTickets(cb: any) {
		this.io.on(TicketChannel.TICKETS, cb);
	}

	public onTicket(cb: any) {
		this.io.on(TicketChannel.TICKET, cb);
	}

	public emitStatus(status: object) {
		this.io.emit(TicketChannel.STATUS, status);
	}

	public emitAssignee(status: object) {
		this.io.emit(TicketChannel.ASSIGNEE, status);
	}

	public emitMail(mail: object) {
		this.io.emit(TicketChannel.MAIL, mail);
	}
}
