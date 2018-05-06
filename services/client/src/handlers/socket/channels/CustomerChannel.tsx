/**
 * CustomerChannel class for handling Socket customer events
 * @module handlers/socket/channels/SettingChannel
 */
import * as SocketIO from 'socket.io-client';

import { Channel } from './Channel';
import { CustomerEvent } from '../models/CustomerEvent';

/**
 * CustomerChannel class
 */
export default class CustomerChannel extends Channel {

	public channel = CustomerEvent.CHANNEL;

	/**
	 * Listen for new customers
	 * @public
	 * @param {Any} cb - A callback function
	 */
	public onCustomers(cb: any) {
		this.listen(cb);
	}

	/**
	 * Emits an addCustomer event to channel
	 * @public
	 * @param {Object} customer - A customer object
	 */
	public emitAddCustomer(customer: object) {
		this.emit(CustomerEvent.ADD, customer);
	}

	/**
	 * Emits an editCustomer event to channel
	 * @public
	 * @param {Object} customer - A customer object
	 */
	public emitEditCustomer(customer: object) {
		this.emit(CustomerEvent.EDIT, customer);
	}

	/**
	 * Emits a deleteCustomer event to channel
	 * @public
	 * @param {Object} customer - A customer object
	 */
	public emitDeleteCustomer(customer: object) {
		this.emit(CustomerEvent.DELETE, customer);
	}
}
