/**
 * Handles the websocket connection against the client.
 */

import * as SocketIO from 'socket.io-client';

/**
 * Handles the connection.
 */
export interface IChannel {
	channel: string;
	listen(event: string, cb: any): void;
	emit(event: string, data: any): void;
}
