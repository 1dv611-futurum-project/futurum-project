/**
 * MessageChannel class for handling Socket error and success events
 * @module handlers/socket/channels/MessageChannel
 */
import * as SocketIO from 'socket.io-client';

import { Channel } from './Channel';
import { MessageEvent } from '../models/MessageEvent';

/**
 * MessageChannel class
 */
export default class MessageChannel extends Channel  {

	public channel = MessageEvent.CHANNEL;

	/**
	 * Listen for new message
	 * @public
	 * @param {Any} cb - A callback function
	 */
	public onMessage(cb: any) {
		this.listen(cb);
	}

	/**
	 * Emits a message success event to channel
	 * @public
	 * @param {object} message - message object
	 */
	public emitSuccessMessage(message: object) {
		this.emit(MessageEvent.SUCCESS, message);
	}

	/**
	 * Emits a message error event to channel
	 * @public
	 * @param {object} message - message object
	 */
	public emitErrorMessage(message: object) {
		console.log('emitErrormessager in MessageChannel node');
		this.emit(MessageEvent.ERROR, message);
	}
}
