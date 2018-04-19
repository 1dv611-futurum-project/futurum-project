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

	public tickets(cb: any) {
		this.io.on('socket', cb);
	}

	public message(data: any) {
		this.io.emit('message', data);
	}

	public client(data: any) {
		this.io.emit('client', data);
	}
}
