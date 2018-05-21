/**
 * Handles the email events.
 */

import ErrorHandler from './ErrorHandler';

/**
 * Handles the email messages.
 */
class MailSender {
	private emailhandler: any;

	constructor(emailhandler: any) {
		this.emailhandler  = emailhandler;
	}

	/**
	 * Sends a statusupdate to the customer.
	 */
	public sendStatusUpdate(payload: any, doSend: boolean): Promise<string> {
		return new Promise((resolve, reject) => {
			const statuses = ['Ej påbörjad', 'Påbörjad', 'Genomförd', 'Stängd'];
			const status = statuses[payload[0].status];
			const mailBody = 'Kundärende \'' + payload[0].title + '\' har fått uppdaterad status.' +
			'\n\n Status för ärende med ärendenamn: \'' + payload[0].title + '\' har ändrats till ' + '\'' + status + '\'';
			const mail = {
				to: payload[0].from.email,
				subject: payload[0].title,
				body: mailBody
			};

			if (doSend) {
				this.emailhandler.Outgoing.send(mail, payload[0].mailId)
				.then((mailID) => {
					resolve(mailID);
				})
				.catch((err) => {
					reject(err);
				});
			} else {
				resolve();
			}
		});
	}

	/**
	 * Sends a message to the customer.
	 */
	public sendMessageUpdate(payload: any): Promise<string> {
		return new Promise((resolve, reject) => {
			const mailSubject = payload.title;
			const mail = {
				to: payload.from.email,
				subject: mailSubject,
				body: payload.body.pop().body
			};

			this.emailhandler.Outgoing.answer(mail, payload.mailId)
			.then((mailID) => {
				resolve(mailID);
			})
			.catch((err) => {
				reject(err);
			});
		});
	}
}

// Exports.
export default MailSender;
