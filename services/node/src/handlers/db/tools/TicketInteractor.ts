/**
 * Interacts with the ticket-model.
 */

// Imports
import DBInteractor from './DBInteractor';
import Ticket from './../models/Ticket';
import Customer from './../models/Customer';
import Assignee from './../models/Assignee';
import ITicket from './../interfaces/ITicket';
import IMail from './../interfaces/IMail';
import IReceivedTicket from './../../email/interfaces/IReceivedTicket';
import { AssigneeMismatchError, CustomerMismatchError } from './../../../config/errors';

/**
 * Declares class.
 */
class TicketInteractor extends DBInteractor {

	/**
	 * Returns the first Ticket that matches the given info.
	 */
	public getOne(info: ITicket): Promise<any> {
		return new Promise((resolve, reject) => {
			Ticket.findOne(info)
			.populate('from')
			.populate('assignee')
			.then((tickets) => {
				resolve(tickets);
			})
			.catch((error) => {
				reject(error);
			});
		});
	}

	/**
	 * Returns all Tickets that matches the given info.
	 */
	public getAll(info: ITicket): Promise<any> {
		return new Promise((resolve, reject) => {
			Ticket.find(info)
			.populate('from')
			.populate('assignee')
			.then((tickets) => {
				resolve(tickets);
			})
			.catch((error) => {
				reject(error);
			});
		});
	}

	/**
	 * Removes one ticket from the database, matching the conditions.
	 */
	public removeOne(removeOn: object): Promise<void> {
		return new Promise((resolve, reject) => {
			Ticket.findOneAndRemove(removeOn)
			.then((removed) => {
				resolve();
			})
			.catch((err) => {
				reject(err);
			});
		});
	}

	/**
	 * Removes all tickets from the database, matching the conditions.
	 */
	public removeAll(removeOn: object): Promise<void> {
		return new Promise((resolve, reject) => {
			Ticket.remove(removeOn)
			.then((removed) => {
				resolve();
			})
			.catch((err) => {
				reject(err);
			});
		});
	}

	/**
	 * Updates the tickets in the database that matches the conditions
	 * with the given info. If no matching tickets are found, creates a
	 * new ticket of the given info.
	 */
	public addOrUpdate(info: IReceivedTicket, conditions: object): Promise<object[]> {
		return new Promise((resolve, reject) => {
			const options = {
				new: true,
				upsert: true,
				setDefaultsOnInsert: true
			};

			this.createNewTicket(conditions, info, options)
			.then((saved) => {
				return this.getOne(saved);
			})
			.then((populated) => {
				if (!Array.isArray(populated)) {
					resolve([populated]);
				} else {
					resolve(populated);
				}
			})
			.catch((error) => {
				reject(error);
			});
		});
	}

	/**
	 * Creates a new ticket or updates an old one.
	 */
	private createNewTicket(conditions: object, info: IReceivedTicket, options: object): Promise<ITicket> {
		return new Promise((resolve, reject) => {
			const ticket = this.getSimpleInfo(info);

			this.addReferencesToTicket(ticket, info)
			.then((referencedTicket) => {
				return Ticket.findOne(conditions);
			})
			.then((ticketShouldUpdate) => {
				let found;

				if (ticketShouldUpdate) {
					found = ticketShouldUpdate;
					const fieldsToUpdate = Object.keys(ticket);
					this.updateFields(found, fieldsToUpdate, ticket, info);
				} else {
					ticket.body = super.createNewMails(info.body);
					found = new Ticket(ticket);
				}

				return found.save();
			})
			.then((saved) => {
				resolve(saved);
			})
			.catch((err) => {
				reject(err);
			});
		});
	}

	/**
	 * Returns the relevant info to update the ticket with.
	 */
	private getSimpleInfo(info: IReceivedTicket): ITicket {
		const ticket = {} as ITicket;

		if (info.mailId) {
			ticket.mailId = info.mailId;
		}

		if (info.created) {
			ticket.created = new Date(info.created);
		}

		if (info.title) {
			ticket.title = info.title;
		}

		if (info.status) {
			ticket.status = info.status;
		}

		if (info.replyId) {
			ticket.replyId = info.replyId;
		}

		if (info.isRead) {
			ticket.isRead = info.isRead;
		}

		return ticket;
	}

	/**
	 * Adds customer and assignee references
	 * to the ticket object given.
	 */
	private addReferencesToTicket(ticket: ITicket, info: IReceivedTicket): Promise<ITicket> {
		return new Promise((resolve, reject) => {
			this.getCustomerReference(info as IReceivedTicket)
			.then((reference) => {

				if (info.from) {
					ticket.from = reference;
				}
				return this.getAssigneeReference(info as IReceivedTicket);
			})
			.then((reference) => {
				if (info.assignee) {
					ticket.assignee = reference;
				}

				resolve(ticket);
			})
			.catch((err) => {
				reject(err);
			});
		});
	}

	/**
	 * Updates the given fields with the given values.
	 */
	private updateFields(toUpdate: ITicket, fieldsToUpdate: string[], valuesToUpdate: object, info: IReceivedTicket) {
		fieldsToUpdate.forEach((attribute) => {
			toUpdate[attribute] = valuesToUpdate[attribute];
		});

		const bodies = Array.isArray(info.body)
		? info.body
		: toUpdate.body.concat(super.createNewMails(info.body));

		toUpdate.body = bodies as IMail[];
	}

	/**
	 * Returns a reference to the _id
	 * of the customer object mapping to the
	 * sender of the email.
	 */
	private getCustomerReference(info: IReceivedTicket): Promise<string> {
		return new Promise((resolve, reject) => {
			if (info.from) {
				Customer.findOne({email: info.from.email})
				.then((customer) => {
					resolve(customer._id);
				})
				.catch(() => {
					reject(new CustomerMismatchError('No such customer in the database'));
				});
			} else {
				resolve(null);
			}
		});
	}

	/**
	 * Returns a reference to the _id
	 * of the assignee object mapping to the
	 * assignee assigned to the ticket.
	 */
	private getAssigneeReference(info: IReceivedTicket): Promise<string> {
		return new Promise((resolve, reject) => {
			if (info.assignee) {
				Assignee.findOne({email: info.assignee.email})
				.then((assignee) => {
					resolve(assignee._id);
				})
				.catch(() => {
					reject(new AssigneeMismatchError('No such assignee in the database'));
				});
			} else {
				resolve(null);
			}
		});
	}
}

// Exports
export default TicketInteractor;
