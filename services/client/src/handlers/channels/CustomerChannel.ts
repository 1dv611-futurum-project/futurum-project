/**
 * Handles the websocket connection against the client.
 */

import * as SocketIO from 'socket.io-client';

/**
 * Handles the connection.
 */
export default class CustomerChannel {

	private static CUSTOMERS: string = 'customers';
	private static ADD_CUSTOMER: string = 'customer:add';
	private static EDIT_CUSTOMER: string = 'customer:edit';
	private static DELETE_CUSTOMER: string = 'customer:delete';

	private io: SocketIOClient.Socket;

	constructor(io: SocketIOClient.Socket) {
		this.io = io;
	}

	public onAllCustomers(cb: any) {
		this.io.on(CustomerChannel.CUSTOMERS, cb);
	}

	public emitAddCustomer(customer: object) {
		this.io.emit(CustomerChannel.ADD_CUSTOMER, customer);
	}

	public emitEditCustomer(customer: object) {
		this.io.emit(CustomerChannel.EDIT_CUSTOMER, customer);
	}

	public emitDeleteCustomer(customer: object) {
		this.io.emit(CustomerChannel.DELETE_CUSTOMER, customer);
	}
}
