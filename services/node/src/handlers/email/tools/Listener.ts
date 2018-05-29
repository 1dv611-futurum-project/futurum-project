/**
 * Listens for email events.
 */

// Imports.
import IReceivedTicket from './../interfaces/IReceivedTicket';
import { IncomingMailEvent } from './../events/IncomingMailEvents';
import Message from './../../socket/models/Message';

/**
 * Handles the connection.
 */
export default class Listener {
	private static latestErrorSecondsSinceEpoch = 0;

	private socket: any;
	private db: any;
	private emitter: any;
	private mailSender: any;
	private mailReciever: any;

	/**
	 * Starts the listeners on incoming mail events.
	 */
	public listen(socket: any, db: any, mailSender: any, mailReciever: any) {
		this.socket = socket;
		this.db = db;
		this.mailSender = mailSender;
		this.mailReciever = mailReciever;

		this.incomingMailListener();
		this.reloadEventListener();
		this.errorListener();
	}

	/**
	 * Listens for incoming emails.
	 */
	private incomingMailListener() {
		this.mailReciever.on(IncomingMailEvent.TICKET, (mail: IReceivedTicket) => {
			this.db.addOrUpdate(IncomingMailEvent.TICKET, mail, { mailId: mail.mailId })
			.then((result) => this.socket.emitter.emitSuccessMessage(`Nytt meddelande från ${result[0].from.name}`))
			.then(() => this.socket.emitter.emitTickets())
			.catch((error) => {
				const failSubject = 'Ticket-system failed to handle incoming ticket: ' + mail.title;
				const forward = {from: mail.from.email, body: mail.body[0].body, subject: failSubject};
				const to = process.env.IMAP_FORWARDING_ADDRESS;

				this.mailSender.forward(forward, mail.mailId, to);
				const message = `Misslyckades med att ta emot nytt meddelande. Vidarebefodras till ${to}`;
				this.socket.emitter.emitErrorMessage(message);
				console.error(error);
			});
		});

		this.mailReciever.on(IncomingMailEvent.ANSWER, (mail) => {
			const query = { $or: [ { replyId: '<' + mail.inAnswerTo + '>' }, { mailId: mail.inAnswerTo} ]};
			this.db.addOrUpdate(IncomingMailEvent.ANSWER, mail, query)
			.then((result) => this.socket.emitter.emitSuccessMessage(`Nytt meddelande från ${result[0].from.name}`))
			.then(() => this.socket.emitter.emitTickets())
			.catch((error) => {
				console.error(error);
				const failSubject = 'Ticket-system failed to handle incoming thread with email from ' + mail.fromName;
				const forward = {from: mail.fromAddress, body: mail.body, subject: failSubject};
				const to = process.env.IMAP_FORWARDING_ADDRESS;

				this.mailSender.forward(forward, mail.mailId, to);
				const message = `Misslyckades med att ta emot nytt meddelande. Vidarebefodras till ${to}`;
				this.socket.emitter.emitErrorMessage(message);
			});
		});

		this.mailReciever.on(IncomingMailEvent.FORWARD, (mail) => {
			const forward = {from: mail.from.email, body: mail.body[0].body, subject: mail.title};
			this.mailSender.forward(forward, mail.mailId, process.env.IMAP_FORWARDING_ADDRESS)
			.then((result) => {
				const to = process.env.IMAP_FORWARDING_ADDRESS;
				const message = `Nytt meddelande från ${mail.from.name} vidarebefodrades till ${to}`;
				this.socket.emitter.emitSuccessMessage(message);
			})
			.catch((error) => {
				console.error(error);

				const message = 'Misslyckades med att vidarebefodra mail från okänd mailaddress';
				this.socket.emitter.emitErrorMessage(message);

				const errorSubject = 'Error: Ticket-system failed to forward non-whitelist email from: ' + mail.from.email;
				const errorBody = 'Ticket-system is recieving errors when forwarding emails not in whitelist.' +
				'Please double check the forwarding address you\ve given and double check emails externally.';
				const to = process.env.IMAP_ERROR_ADDRESS || process.env.IMAP_FORWARDING_ADDRESS;
				const send = {body: mail.body[0].body, subject: errorSubject, to};

				this.mailSender.send(send);
			});
		});
	}

	/**
	 * Listens for events that will cause the user to have to reload page.
	 */
	private reloadEventListener() {
		this.mailReciever.on(IncomingMailEvent.UNAUTH, (payload) => {
			const message = 'User is not authorized, please reload the page to authorize.';
			this.socket.emitter.emitErrorMessage(new Message('error', message));
		});

		this.mailReciever.on(IncomingMailEvent.MESSAGE, () => {
			const message = 'Emails are being accesses externally. Possibly reload the page to ensure continued validity.';
			this.socket.emitter.emitErrorMessage(new Message('error', message));
		});

		this.mailReciever.on(IncomingMailEvent.TAMPER, () => {
			const message = 'Emails are being accesses externally. Possibly reload the page to ensure continued validity.';
			this.socket.emitter.emitErrorMessage(new Message('error', message));
		});
	}

	/**
	 * Listens for errors.
	 */
	private errorListener() {
		this.mailReciever.on(IncomingMailEvent.ERROR, (error, mail) => {
			const message = 'Email error. Reload page and double check emails externally.';
			this.socket.emitter.emitErrorMessage(new Message('error', message));

			if (!(this.continuousError()) && !mail) {
				const to = process.env.IMAP_ERROR_ADDRESS || process.env.IMAP_FORWARDING_ADDRESS;
				const errorSubject = 'Error: Something is going wrong with the ticket-system handling incoming emails.';
				const errorBody = 'Ticket-system is recieving errors from incoming emails.' +
				'Please reload the app-page or restart the server and double check emails externally.';
				const send = {body: errorBody, subject: errorSubject, to};

				this.mailSender.send(send);
			} else if (mail) {
				const to = process.env.IMAP_FORWARDING_ADDRESS;
				const failSubject = 'Ticket-system failed to handle incoming ticket: ' + mail.subject;
				const forward = {from: mail.from[0].address, body: mail.text, subject: failSubject};

				this.mailSender.forward(forward, mail.messageId, to);
			}
		});
	}

	/**
	 * Checks that the errors are not continuous, so as to not spam error-emails.
	 */
	private continuousError() {
		const secondsSinceLastError = (new Date().getTime() / 1000) - Listener.latestErrorSecondsSinceEpoch;

		if (secondsSinceLastError > 600) {
			Listener.latestErrorSecondsSinceEpoch = (new Date().getTime() / 1000);
			return false;
		} else {
			return true;
		}
	}
}
