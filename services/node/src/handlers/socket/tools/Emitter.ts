/**
 * Handles the websocket connection against the client.
 */

// Imports.
import * as SocketIo from 'socket.io';
import ErrorHandler from './ErrorHandler';
import Message from './../models/Message';

/**
 * Handles the connection.
 */
export default class Emitter {
	private io: any;
	private db: any;

	constructor(io: any, db: any) {
		this.io = io;
		this.db = db;
	}

	/**
	 * Emits all data to the client.
	 */
	public emitAll() {
		this.emitTickets();
		this.emitAssignees();
		this.emitCustomers();
		this.emitExpiredCookie();
		// this.emitSettings();
	}

	/**
	 * Emits data to the server on ticket channels.
	 */
	public emitTickets(): void {
		this.db.getAll('ticket', {})
		.then((tickets: any) => {
			this.io.emit('tickets', JSON.stringify(tickets));
			this.io.broadcast.emit('tickets', JSON.stringify(tickets));
		})
		.catch((error) => {
			throw new ErrorHandler(this.io).DbFetchError('tickets');
		});
	}

	/**
	 * Emits data to the server on assignee channels.
	 */
	public emitAssignees(): void {
		this.db.getAll('assignee', {})
		.then((assignees: any) => {
			this.io.emit('assignees', JSON.stringify(assignees));
			this.io.broadcast.emit('assignees', JSON.stringify(assignees));
		})
		.catch((error) => {
			throw new ErrorHandler(this.io).DbFetchError('assignees');
		});
	}

	/**
	 * Emits data to the server on customer channels.
	 */
	public emitCustomers(): void {
		this.db.getAll('customer', {})
		.then((customers: any) => {
			this.io.emit('customers', JSON.stringify(customers));
			this.io.broadcast.emit('customers', JSON.stringify(customers));
		})
		.catch((error) => {
			throw new ErrorHandler(this.io).DbFetchError('customers');
		});
	}

	/**
	 * Emits data to the server on message channels.
	 */
	public emitSuccessMessage(message: object): void {
		this.io.emit('messages', JSON.stringify(message));
	}

	/**
	 * Emits data to the server on message channels.
	 */
	public emitErrorMessage(message: object): void {
		this.io.emit('messages', JSON.stringify(message));
	}

	/**
	 * Emit information about expired jwt.
	 */
	public emitExpiredCookie(): void {
		const exp = new Date(this.io.decoded_token.exp * 1000).getTime() - new Date().getTime();
		setTimeout(() => {
			this.io.emit('expired');
			this.io.disconnect();
		}, exp);
	}

	// /**
	//  * Proof of concept: channel for settings
	//  * Emits data to the server on settings channels.
	//  */
	// public emitSettings(): void {
	// 	this.io.emit('settings', JSON.stringify([]));
	// }
}
