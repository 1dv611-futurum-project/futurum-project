/**
 * Interacts with the asignee-model.
 */

// Imports
import DBInteractor from './DBInteractor';
import Assignee from './../models/Assignee';
import IAssignee from './../interfaces/IAssignee';
import { DBCreationError} from './../../../config/errors';

/**
 * Declares class.
 */
class AssigneeInteractor extends DBInteractor {

	/**
	 * Returns the first Assignee that matches the given info.
	 */
	public getOne(info: IAssignee): Promise<any> {
		return new Promise((resolve, reject) => {
			Assignee.findOne(info)
			.then((assignee) => {
				resolve(assignee);
			})
			.catch((error) => {
				reject(error);
			});
		});
	}

	/**
	 * Returns all Assignees that matches the given info.
	 */
	public getAll(info: IAssignee): Promise<any> {
		return new Promise((resolve, reject) => {
			Assignee.find(info)
			.then((assignee) => {
				resolve(assignee);
			})
			.catch((error) => {
				reject(error);
			});
		});
	}

	/**
	 * Removes one assignee from the database, matching the conditions.
	 */
	public removeOne(removeOn: object): Promise<void> {
		return new Promise((resolve, reject) => {
			Assignee.findOneAndRemove(removeOn)
			.then((removed) => {
				resolve();
			})
			.catch((err) => {
				reject(err);
			});
		});
	}

	/**
	 * Removes all assignees from the database, matching the conditions.
	 */
	public removeAll(removeOn: object): Promise<void> {
		return new Promise((resolve, reject) => {
			Assignee.remove(removeOn)
			.then((removed) => {
				resolve();
			})
			.catch((err) => {
				reject(err);
			});
		});
	}

	/**
	 * Updates the assignees in the database that matches the conditions
	 * with the given info. If no matching assignees are found, creates a
	 * new assignee of the given info.
	 */
	public addOrUpdate(info: IAssignee, conditions: object): Promise<object[]> {
		return new Promise((resolve, reject) => {
			const options = {
				new: true,
				upsert: true,
				setDefaultsOnInsert: true
			};

			this.createNewAssignee(conditions, info, options)
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
	 * Creates a new assignee.
	 */
	private createNewAssignee(conditions: object, assignee: IAssignee, options: object): Promise<any> {
		return new Promise((resolve, reject) => {
			Assignee.findOneAndUpdate(conditions, assignee, options, (err, saved) => {
				if (err) {
					reject(new DBCreationError('Assignee could not be saved in the Database.'));
				}

				resolve(saved);
			});
		});
	}
}

// Exports
export default AssigneeInteractor;
