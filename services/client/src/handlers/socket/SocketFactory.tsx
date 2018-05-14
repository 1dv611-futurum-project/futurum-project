/**
 * Handles the websocket connection against the client.
 * @module handlers/socket/SocketFactory
 */
import * as SocketIO from 'socket.io-client';
import * as Cookies from 'js-cookie';

import TicketChannel from './channels/TicketChannel';
import AssigneeChannel from './channels/AssigneeChannel';
import CustomerChannel from './channels/CustomerChannel';
import SettingChannel from './channels/SettingChannel';
import MessageChannel from './channels/MessageChannel';

/**
 * SocketFactory class
 */
export default class SocketFactory {

	private static URL: string = 'http://127.0.0.1:8080';
	private static PATH: string = '/socket';

	private io: SocketIOClient.Socket;

	constructor() {
		this.config();
	}

	/**
	 * Sets up Websocket config
	 * @private
	 */
	private config() {
		this.io = SocketIO(SocketFactory.URL, {
			path: SocketFactory.PATH,
			query: 'token=' + Cookies.get('jwt')
		});
	}

	/**
	 * Checks if token is valid or has expired
	 * @private
	 */
	public isValidToken(cb: any) {
		this.io.on('connect', (socket: any) => {
			cb(true);
		});

		this.io.on('disconnect', (socket: any) => {
			cb(false);
		});

		this.io.on('expired', (error: any) => {
			cb(false);
		});

		this.io.on('error', (error: any) => {
			cb(false);
		});
	}

	/**
	 * Initiates a new MessageChannel
	 * @public
	 */
	public messageChannel() {
		return new MessageChannel(this.io);
	}

	/**
	 * Initiates a new TicketChannel
	 * @public
	 */
	public ticketChannel() {
		return new TicketChannel(this.io);
	}

	/**
	 * Initiates a new AssigneeChannel
	 * @public
	 */
	public assigneeChannel() {
		return new AssigneeChannel(this.io);
	}

	/**
	 * Initiates a new CustomerChannel
	 * @public
	 */
	public customerChannel() {
		return new CustomerChannel(this.io);
	}

	// /**
	//  * Proof Of Concept: Settings-channel for e.g. status colors
	//  * Initiates a new SettingChannel
	//  * @public
	//  */
	// public settingChannel() {
	// 	return new SettingChannel(this.io);
	// }
}
