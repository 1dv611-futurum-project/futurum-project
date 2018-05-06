/**
 * Defines the interface for Websocket channels
 */
import * as SocketIO from 'socket.io-client';

/**
 * IChannel Interface props
 */
export interface IChannel {
	channel: string;
	listen(event: string, cb: any): void;
	emit(event: string, data: any): void;
}
