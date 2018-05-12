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
}
