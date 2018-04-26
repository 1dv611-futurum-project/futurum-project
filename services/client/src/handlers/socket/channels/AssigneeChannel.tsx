/**
 * Handles the websocket connection against the client.
 */

import * as SocketIO from 'socket.io-client';

import { Channel } from './Channel';
import { AssigneeEvent } from '../events/AssigneeEvent';

/**
 * Handles customer events
 */
export default class AssigneeChannel extends Channel {

	public channel = AssigneeEvent.CHANNEL;

	public onAssignees(cb: any) {
		this.listen(cb);
	}
}
