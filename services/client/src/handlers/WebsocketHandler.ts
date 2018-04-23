/**
 * Handles the websocket connection with the server.
 */

// Imports.
import * as events from 'events';
import * as SocketIO from 'socket.io-client';
// const EM = new events.EventEmitter();

/**
 * Handles the connection.
 */
class WebsocketHandler {

	// private EM: EventEmitter = new events.EventEmitter();
	private static URL: string = 'http://localhost:8080';
	private socket: SocketIOClient.Socket;

	constructor() {
		this.listen();
	}

	/**
	 * Initiate socket handling
	 */
	private listen(): void {
		this.socket = SocketIO(WebsocketHandler.URL, {
			path: '/socket'
		});

		this.socket.on('connect', () => {
			console.log('client connected in websockethandler');
		});
	}

	/**
		* Emits data to the server on ticket channels.
		*/
	public emitTicket(ticket: object): void {
		try {
			this.socket.emit('ticket', JSON.stringify(ticket));
		} catch (error) {
			console.error(error);
		}
	}

	/**
		* Emits data to the server on customer channels.
		*/
	public emitCustomer(customer: object): void {
		try {
			this.socket.emit('customer', JSON.stringify(customer));
		} catch (error) {
			console.error(error);
		}
	}

	/**
		* Emits data to the server on settings channels.
		*/
	public emitSettings(settings: object): void {
		try {
			this.socket.emit('settings', JSON.stringify(settings));
		} catch (error) {
			console.error(error);
		}
	}

	/**
		* Emits data to all ticket listeners.
		*/
	public ticket(callback: any ): void {
		this.socket.on('ticket', callback );
		/*
		EM.on('onTicket', () => {
			console.log('EM.on');
			EM.emit('onTicket', this.ticket);
		});
		*/
	}

	/**
		* Emits data to all customer listeners.
		*/
	public customer(callback: any ): void {
		this.socket.on('customer', callback);
	}

	/**
		* Emits data to all settings listeners.
		*/
	public settings(callback: any ): void {
		this.socket.on('customer', callback);
	}
}

// Exports.
export default WebsocketHandler;
