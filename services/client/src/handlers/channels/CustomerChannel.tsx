/**
 * Handles the websocket connection against the client.
 */

import * as SocketIO from 'socket.io-client';

import { Channel } from './Channel';
import { CustomerEvent } from '../events/CustomerEvent';

/**
 * Handles customer events
 */
export default class CustomerChannel extends Channel {

	public channel = CustomerEvent.CHANNEL;

	public onCustomers(cb: any) {
		this.listen(cb);
	}

	public emitAddCustomer(customer: object) {
		this.emit(CustomerEvent.ADD, customer);
	}

	public emitEditCustomer(customer: object) {
		this.emit(CustomerEvent.EDIT, customer);
	}

	public emitDeleteCustomer(customer: object) {
		this.emit(CustomerEvent.DELETE, customer);
	}
}
