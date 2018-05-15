/**
 * Interacts with the customer-model.
 */

// Imports
import DBInteractor from './DBInteractor';
import Customer from './../models/Customer';
import Ticket from './../models/Ticket';
import ICustomer from './../interfaces/ICustomer';
import { DBCreationError} from './../../../config/errors';

/**
 * Declares class.
 */
class CustomerInteractor extends DBInteractor {

	/**
	 * Returns the first Customer that matches the given info.
	 */
	public getOne(info: ICustomer): Promise<any> {
		return new Promise((resolve, reject) => {
			Customer.findOne(info)
			.then((customer) => {
				resolve(customer);
			})
			.catch((error) => {
				reject(error);
			});
		});
	}

	/**
	 * Returns all Customers that matches the given info.
	 */
	public getAll(info: ICustomer): Promise<any> {
		return new Promise((resolve, reject) => {
			Customer.find(info)
			.then((customers) => {
				return Promise.all(customers.map((customer) => {
					return Ticket.find({from: customer._id})
					.then((tickets) => {
						customer.errands = tickets.length;
						return customer;
					});
				}));
			})
			.then((customers) => {
				resolve(customers);
			})
			.catch((error) => {
				reject(error);
			});
		});
	}

	/**
	 * Removes one customer from the database, matching the conditions.
	 */
	public removeOne(removeOn: object): Promise<void> {
		return new Promise((resolve, reject) => {
			Customer.findOneAndRemove(removeOn)
			.then((removed) => {
				resolve();
			})
			.catch((err) => {
				reject(err);
			});
		});
	}

	/**
	 * Removes all customer from the database, matching the conditions.
	 */
	public removeAll(removeOn: object): Promise<void> {
		return new Promise((resolve, reject) => {
			Customer.remove(removeOn)
			.then((removed) => {
				resolve();
			})
			.catch((err) => {
				reject(err);
			});
		});
	}

	/**
	 * Updates the customers in the database that matches the conditions
	 * with the given info. If no matching customers are found, creates a
	 * new customer of the given info.
	 */
	public addOrUpdate(info: ICustomer, conditions: object): Promise<object[]> {
		return new Promise((resolve, reject) => {
			const options = {
				new: true,
				upsert: true,
				setDefaultsOnInsert: true
			};

			this.createNewCustomer(conditions, info, options)
			.then((saved) => {
				if (!Array.isArray(saved)) {
					resolve([saved]);
				} else {
					resolve(saved);
				}
			})
			.catch((error) => {
				reject(error);
			});
		});
	}

	/**
	 * Creates a new customer.
	 */
	private createNewCustomer(conditions: object, customer: ICustomer, options: object): Promise<any> {
		return new Promise((resolve, reject) => {
			Customer.findOneAndUpdate(conditions, customer, options, (err, saved) => {
				if (err) {
					reject(new DBCreationError('Customer could not be saved in the Database.'));
				}

				resolve(saved);
			});
		});
	}
}

// Exports
export default CustomerInteractor;
