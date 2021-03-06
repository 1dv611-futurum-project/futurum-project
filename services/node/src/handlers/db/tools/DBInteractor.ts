/**
 * Abstract class to extend for interacting with the database models.
 */

// Imports
import IMail from './../interfaces/IMail';

abstract class DBInteractor {
	public abstract addOrUpdate(info: object, conditions: object): Promise<object[]>;

	/**
	 * Creates an array of mail-bodies.
	 */
	protected createNewMails(emails: any): IMail[] {
		const mailBodies = [];
		emails = Array.isArray(emails) ? emails : [emails];
		emails.forEach((email) => {
			if (email) {
				mailBodies.push({
					received: email.received,
					fromName: email.fromName,
					body: email.body
				});
			}
		});
		return mailBodies;
	}
}

// Exports
export default DBInteractor;
