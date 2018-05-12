/**
 * AssigneeChannel class for handling Socket assignee events
 * @module handlers/socket/channels/SettingChannel
 */
import * as SocketIO from 'socket.io-client';

import { Channel } from './Channel';
import { AssigneeEvent } from '../models/AssigneeEvent';

/**
 * AssigneeChannel class
 */
export default class AssigneeChannel extends Channel {

	public channel = AssigneeEvent.CHANNEL;

	/**
	 * Listen for new assignees
	 * @public
	 * @param {Any} cb - A callback function
	 */
	public onAssignees(cb: any) {
		this.listen(cb);
	}

	/**
	 * Emits an addAssignee event to channel
	 * @public
	 * @param {Object} assignee - A customer object
	 */
	public emitAddAssignee(assignee: object) {
		this.emit(AssigneeEvent.ADD, assignee);
	}

	/**
	 * Emits an editAssignee event to channel
	 * @public
	 * @param {Object} assignee - A customer object
	 */
	public emitEditAssignee(assignee: object) {
		this.emit(AssigneeEvent.EDIT, assignee);
	}

	/**
	 * Emits a deleteAssignee event to channel
	 * @public
	 * @param {Object} assignee - A customer object
	 */
	public emitDeleteAssignee(assignee: object) {
		this.emit(AssigneeEvent.DELETE, assignee);
	}
}
