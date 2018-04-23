/**
 * Handles the websocket connection against the client.
 */

import * as SocketIO from 'socket.io-client';
import TicketsChannel from './channels/TicketsChannel';
import CustomerChannel from './channels/CustomerChannel';
import SettingsChannel from './channels/SettingsChannel';

/**
 * Handles the connection.
 */
export default class SocketFactory {

	private static URL: string = 'http://localhost:8080';
	private static PATH: string = '/socket';

	private io: SocketIOClient.Socket;

	constructor() {
		this.config();
	}

	private config() {
		this.io = SocketIO(SocketFactory.URL, { path: SocketFactory.PATH });
	}

	public tickets() {
		return new TicketsChannel(this.io);
	}

	public customers() {
		return new CustomerChannel(this.io);
	}

	public settings() {
		return new SettingsChannel(this.io);
	}
}
