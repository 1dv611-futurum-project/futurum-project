/**
 * SettingChannel class for handling Socket settings events
 * @module handlers/socket/channels/SettingChannel
 */
import * as SocketIO from 'socket.io-client';

import { Channel } from './Channel';
import { SettingEvent } from '../models/SettingEvent';

/**
 * SettingChannel class
 */
export default class SettingChannel extends Channel  {

	public channel = SettingEvent.CHANNEL;

	/**
	 * Listen for new settings
	 * @public
	 * @param {Any} cb - A callback function
	 */
	public onSettings(cb: any) {
		this.listen(cb);
	}

	/**
	 * Emits a setting event to channel
	 * @public
	 * @param {Array} settings - Settings array
	 */
	public emitSettings(settings: object[]) {
		this.emit(SettingEvent.UPDATE, settings);
	}
}
