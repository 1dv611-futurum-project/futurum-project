/**
 * Base Channel class for Websocket channels
 * @module handlers/socket/channels/Channel
 */
import * as SocketIO from 'socket.io-client';
import { IChannel } from './interfaces/IChannel';

/**
 * Channel class
 */
export class Channel implements IChannel {

	private io: SocketIOClient.Socket;
	public channel: string;

	constructor(io: SocketIOClient.Socket) {
		this.io = io;
	}

	/**
	 * Listen for incoming events
	 * @public
	 * @param {Any} cb - A callback function
	 */
	public listen(cb: any) {
		this.io.on(this.channel, cb);
	}

	/**
	 * Emits an event to channel
	 * @public
	 * @param {String} event - The channel event type (see event enums)
	 * @param {Object} data - The event data
	 */
	public emit(event: string, data: any) {
		this.io.emit(this.channel, event, data);
	}
}
