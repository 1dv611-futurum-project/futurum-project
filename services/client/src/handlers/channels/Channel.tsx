/**
 * Handles the websocket connection against the client.
 */

import * as SocketIO from 'socket.io-client';
import { IChannel } from './IChannel';

/**
 * Handles the connection.
 */
export class Channel implements IChannel {

	private io: SocketIOClient.Socket;
	public channel: string;

	constructor(io: SocketIOClient.Socket) {
		this.io = io;
	}

	public listen(cb: any) {
		console.log(this.channel);
		this.io.on(this.channel, cb);
	}

	public emit(event: string, data: any) {
		this.io.emit(this.channel, event, data);
	}
}
