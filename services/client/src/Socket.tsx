/**
 * Handles the websocket connection against the client.
 */

import * as SocketIO from 'socket.io-client';

/**
 * Handles the connection.
 */
export default class Socket {

	private static URL: string = 'http://localhost:8080';
	private static PATH: string = '/socket';
	private io: SocketIOClient.Socket;

	constructor() {
		this.config();
	}

	private config() {
		this.io = SocketIO(Socket.URL, { path: Socket.PATH });
	}

	public onTicket(cb: any) {
		this.io.on('ticket', cb);
	}

	public onTickets(cb: any) {
		this.io.on('tickets', cb);
	}

	public onCustomers(cb: any) {
		this.io.on('customers', cb);
	}

	public emitSettings(settings: object[]) {
		this.io.emit('settings', settings);
	}

	public emitTicket(ticket: object) {
		this.io.emit('ticket', ticket);
	}

	public emitCustomer(customer: object) {
		this.io.emit('customer', customer);
	}

}
