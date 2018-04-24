/**
 * Handles the websocket connection against the client.
 */

import * as SocketIO from 'socket.io-client';

/**
 * Handles the connection.
 */
export default class SettingsChannel {

	private static SETTINGS: string = 'settings';
	private static COLOR: string = 'settings:color';
	private static ASSIGNEE: string = 'settings:assignee';

	private io: SocketIOClient.Socket;

	constructor(io: SocketIOClient.Socket) {
		this.io = io;
	}

	public onSettings(cb: any) {
		this.io.on(SettingsChannel.SETTINGS, cb);
	}

	public emitColorSettings(settings: object[]) {
		this.io.emit(SettingsChannel.COLOR, settings);
	}

	public emitAssigneeSettings(settings: object[]) {
		this.io.emit(SettingsChannel.ASSIGNEE, settings);
	}
}
