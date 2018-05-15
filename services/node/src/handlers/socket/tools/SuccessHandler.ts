
import { TicketEvent } from '../models/TicketEvent';
import { AssigneeEvent } from '../models/AssigneeEvent';
import { CustomerEvent } from '../models/CustomerEvent';
import { SettingEvent } from '../models/SettingEvent';

import Message from '../models/Message';

/**
 * Handles the error messages to client.
 */
export default class SuccessHandler {
	private m: Message;
	private io: any;

	constructor(io: any) {
		this.io = io;
	}

	public TicketSuccess(collection: string) {
		switch (collection) {
			case TicketEvent.ASSIGNEE:
				this.m = new Message('success', `Den tilldelade för ärendet har uppdaterats`);
				this.emitSuccessMessage(this.m);
				break;
			case TicketEvent.STATUS:
				this.m = new Message('success', `Status för ärendet har uppdaterats`);
				this.emitSuccessMessage(this.m);
				break;
			case TicketEvent.MESSAGE:
				this.m = new Message('success', `Meddelandet har skickats till kund`);
				this.emitSuccessMessage(this.m);
				break;
		}
	}

	public CustomerSuccess(collection: string, info?: string) {
		switch (collection) {
			case CustomerEvent.ADD:
				this.m = new Message('success', `Den nya kunden har lagts till i listan.`);
				this.emitSuccessMessage(this.m);
				break;
			case CustomerEvent.EDIT:
				this.m = new Message('success', `Kundens uppgifter har uppdaterats`);
				this.emitSuccessMessage(this.m);
				break;
			case CustomerEvent.DELETE:
				this.m = new Message('success', `Kunden har tagits bort från kundlistan`);
				this.emitSuccessMessage(this.m);
				break;
		}
	}

	public AssigneeSuccess(collection: string, info?: string) {
		switch (collection) {
			case AssigneeEvent.ADD:
				this.m = new Message('success', `Den nya ansvarige har lagts till i listan.`);
				this.emitSuccessMessage(this.m);
				break;
			case AssigneeEvent.EDIT:
				this.m = new Message('success', `Den ansvariges uppgifter har uppdaterats`);
				this.emitSuccessMessage(this.m);
				break;
			case AssigneeEvent.DELETE:
				this.m = new Message('success', `Den ansvarige har tagits bort från listan`);
				this.emitSuccessMessage(this.m);
				break;
		}
	}

	public emitSuccessMessage(message: object): void {
		this.io.emit('messages', JSON.stringify(message));
	}
}
