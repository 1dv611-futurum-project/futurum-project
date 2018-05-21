/**
 * Handles the websocket connection against the client.
 */

// Imports.
import * as SocketIo from 'socket.io';
import { runInThisContext } from 'vm';

import { TicketEvent } from '../models/TicketEvent';
import { AssigneeEvent } from '../models/AssigneeEvent';
import { CustomerEvent } from '../models/CustomerEvent';
import { SettingEvent } from '../models/SettingEvent';

import SuccessHandler from './SuccessHandler';
import ErrorHandler from './ErrorHandler';

/**
 * Handles the connection.
 */
export default class Listener {
	private io: any;
	private db: any;
	private emitter: any;
	private mailSender: any;

	constructor(io: any, db: any, mailSender: any, emitter: any) {
		this.io = io;
		this.db = db;
		this.emitter = emitter;
		this.mailSender = mailSender;
	}

	/**
	 * Starts listening for all client-events.
	 */
	public startListeners() {
		this.ticketListener();
		this.customerListener();
		this.assigneeListener();
		// this.settingsListener();
	}

	/**
	 * Listens for events concerning ticket-changes.
	 */
	private ticketListener() {
		this.io.on('tickets', (event: string, data: any) => {
			const ticket = data.ticket;
			ticket.assignee = ticket.assignee || '-';
			switch (event) {
				case TicketEvent.ASSIGNEE:
					this.db.addOrUpdate('ticket', ticket, { ticketId: ticket.ticketId })
					.then(() => this.emitter.emitAll())
					.then(() => new SuccessHandler(this.io).TicketSuccess(TicketEvent.ASSIGNEE))
					.catch((error: any) => { throw new ErrorHandler(this.io).DbSaveError('ticket'); })
					.catch((error: any) => error ? console.error(error) : null);
					break;
				case TicketEvent.STATUS:
					this.db.addOrUpdate('ticket', ticket, { ticketId: ticket.ticketId })
					.then((payload: any) => this.mailSender.sendStatusUpdate(payload, data.send))
					.then((payload: any) => this.updateTicket(ticket, payload))
					.then(() => this.emitter.emitAll())
					.then(() => new SuccessHandler(this.io).TicketSuccess(TicketEvent.STATUS))
					.catch((error: any) => {
						if (error.name === 'GmailError') {
							throw new ErrorHandler(this.io).SendMessageError();
						}
						throw new ErrorHandler(this.io).DbSaveError('ticket');
					})
					.catch((error: any) => error ? console.error(error) : null);
					break;
				case TicketEvent.MESSAGE:
					this.db.getOne('ticket', { ticketId: ticket.ticketId })
					.then((payload: any) => this.handleMessage(ticket, payload))
					.then((payload: any) => this.updateTicket(ticket, payload))
					.then(() => this.emitter.emitAll())
					.then(() => new SuccessHandler(this.io).TicketSuccess(TicketEvent.MESSAGE))
					.catch((error: any) => {
						this.emitter.emitAll();
						throw new ErrorHandler(this.io).SendMessageError();
					})
					.catch((error: any) => error ? console.error(error) : null);
					break;
				case TicketEvent.READ:
					this.db.addOrUpdate('ticket', { isRead: ticket.isRead }, { ticketId: ticket.ticketId })
					.catch((error: any) => { throw new ErrorHandler(this.io).DbSaveError('ticket'); })
					.catch((error: any) => error ? console.error(error) : null);
					break;
			}
		});
	}

	/**
	 * Listens for customer-events.
	 */
	private customerListener() {
		this.io.on('customers', (event: string, customer: any) => {
			const email = Array.isArray(customer.email) ? customer.email[0] : customer.email;
			customer.email = email;

			switch (event) {
				case CustomerEvent.ADD:
					this.db.getOne('customer', { email })
					.then((cust) => this.handleCustomerAdd(cust, customer))
					.then(() => this.emitter.emitCustomers())
					.then(() => new SuccessHandler(this.io).CustomerSuccess(CustomerEvent.ADD))
					.catch((error: any) => this.handleCustomerAddError(error))
					.catch((error: any) => error ? console.error(error) : null);
					break;
				case CustomerEvent.EDIT:
					this.db.addOrUpdate('customer', customer, { _id: customer._id })
					.then(() => this.emitter.emitAll())
					.then(() => new SuccessHandler(this.io).CustomerSuccess(CustomerEvent.EDIT))
					.catch((error: any) => { throw new ErrorHandler(this.io).DbSaveError('customers'); })
					.catch((error: any) => error ? console.error(error) : null);
					break;
				case CustomerEvent.DELETE:
					this.db.removeAll('ticket', { from: customer._id })
					.then(() => this.db.removeOne('customer', { _id: customer._id }))
					.then(() => this.emitter.emitAll())
					.then(() => new SuccessHandler(this.io).CustomerSuccess(CustomerEvent.DELETE))
					.catch((error: any) => { throw new ErrorHandler(this.io).DbSaveError('customers'); })
					.catch((error: any) => error ? console.error(error) : null);
					break;
			}
		});
	}

	/**
	 * Listens for assignee-events.
	 */
	private assigneeListener() {
		this.io.on('assignees', (event: string, assignee: any) => {

			switch (event) {
				case AssigneeEvent.ADD:
					this.db.getOne('assignee', { email: assignee.email })
					.then((ass) => this.handleAssigneeAdd(ass, assignee))
					.then(() => this.emitter.emitAll())
					.then(() => new SuccessHandler(this.io).AssigneeSuccess(AssigneeEvent.ADD))
					.catch((error: any) => this.handleAssigneeAddError(error))
					.catch((error: any) => error ? console.error(error) : null);
					break;
				case AssigneeEvent.EDIT:
					this.db.addOrUpdate('assignee', assignee, { _id: assignee._id })
					.then(() => this.emitter.emitAll())
					.then(() => new SuccessHandler(this.io).AssigneeSuccess(AssigneeEvent.EDIT))
					.catch((error: any) => { throw new ErrorHandler(this.io).DbSaveError('assignees'); })
					.catch((error: any) => error ? console.error(error) : null);
					break;
				case AssigneeEvent.DELETE:
					this.db.removeOne('assignee', { _id: assignee._id })
					.then(() => this.emitter.emitAssignees())
					.then(() => new SuccessHandler(this.io).AssigneeSuccess(AssigneeEvent.DELETE))
					.catch((error: any) => { throw new ErrorHandler(this.io).DbSaveError('assignees'); })
					.catch((error: any) => error ? console.error(error) : null);
					break;
			}
		});
	}

	// Proof Of Concept: Settings-channel for e.g. status colors
	// private settingsListener() {
	//   this.io.on('settings', (event: string, data: any) => {
	//     const setting = data.setting;
	//     switch (event) {
	//     case SettingEvent.UPDATE:
	//       // TODO: add settings to db
	//       break;
	//     }
	//   });
	// }

	/**
	 * Updates ticket in the database.
	 */
	private updateTicket(ticket: any, payload: any): any {
		if (payload) {
			ticket.replyId.push(payload);
		}
		return this.db.addOrUpdate('ticket', ticket, { ticketId: ticket.ticketId });
	}

	/**
	 * Creates and sends a message to an email.
	 */
	private handleMessage(ticket, payload): any {
		const newMessage = ticket.body[ticket.body.length - 1];
		newMessage.fromName = payload.assignee ? payload.assignee.name || 'Futurum Digital' : 'Futurum Digital';
		ticket.body[ticket.body.length - 1] = newMessage;
		payload.body.push(newMessage);

		return this.mailSender.sendMessageUpdate(payload);
	}

	/**
	 * Adds customer to the database.
	 */
	private handleCustomerAdd(result, customer) {
		if (!result) {
			return this.db.addOrUpdate('customer', customer, { email: customer.email });
		} else {
			return Promise.reject('exists');
		}
	}

	/**
	 * Handles customer-errors when adding customers.
	 */
	private handleCustomerAddError(error: any) {
		if (error === 'exists') {
			throw new ErrorHandler(this.io).CustomerExistsError();
		}
		throw new ErrorHandler(this.io).DbSaveError('customers');
	}

	/**
	 * Adds assignee to the database.
	 */
	private handleAssigneeAdd(result, assignee) {
		if (!result) {
			return this.db.addOrUpdate('assignee', assignee, { email: assignee.email });
		} else {
			return Promise.reject('exists');
		}
	}

	/**
	 * Handles assignee-errors when adding assignees to the database.
	 */
	private handleAssigneeAddError(error: any) {
		if (error === 'exists') {
			throw new ErrorHandler(this.io).AssigneeExistsError();
		}
		throw new ErrorHandler(this.io).DbSaveError('assignees');
	}
}
