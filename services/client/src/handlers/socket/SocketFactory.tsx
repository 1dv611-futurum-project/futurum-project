/**
 * Handles the websocket connection against the client.
 */

import * as SocketIO from 'socket.io-client';
import * as Cookies from 'js-cookie';
import TicketChannel from './channels/TicketChannel';
import AssigneeChannel from './channels/AssigneeChannel';
import CustomerChannel from './channels/CustomerChannel';
import SettingChannel from './channels/SettingChannel';

/**
 * Handles the connection.
 */
export default class SocketFactory {

	private static URL: string = 'http://127.0.0.1:8080';
	private static PATH: string = '/socket';

	private io: SocketIOClient.Socket;

	constructor() {
		this.config();
	}

	private config() {
		this.io = SocketIO(SocketFactory.URL, {
			path: SocketFactory.PATH,
			query: 'token=' + Cookies.get('jwt')
		});
	}

	public isValidToken(cb: any) {
		this.io.on('connect', () => {
			cb(true);
		});

		this.io.on('error', (error: any) => {
			cb(false);
		});
	}

	public ticketChannel() {
		return new TicketChannel(this.io);
	}

	public assigneeChannel() {
		return new AssigneeChannel(this.io);
	}

	public customerChannel() {
		return new CustomerChannel(this.io);
	}

	public settingChannel() {
		return new SettingChannel(this.io);
	}
}
