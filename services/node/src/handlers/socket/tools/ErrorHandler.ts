
import Message from '../models/Message';

/**
 * Handles the error messages to client.
 */
export default class ErrorHandler extends Error {
	private m: Message;
	private io: any;

	constructor(io: any) {
		super();
		this.io = io;
	}

	public DbFetchError(collection: string) {
		this.m = new Message('error', `Ett fel uppstod vid hämtning av "${collection}"`);
		this.emitErrorMessage(this.m);
	}

	public DbSaveError(collection: string) {
		this.m = new Message('error', `Ett fel uppstod vid uppdatering av "${collection}"`);
		this.emitErrorMessage(this.m);
	}

	public SendMessageError() {
		this.m = new Message('error', `Ett fel uppstod vid utskick av meddelande. Är du inloggad?`);
		this.emitErrorMessage(this.m);
	}

	public CustomerExistsError() {
		this.m = new Message('error', `Kunden som du försöker lägga till finns redan`);
		this.emitErrorMessage(this.m);
	}

	public AssigneeExistsError() {
		this.m = new Message('error', `Den ansvarige som du försöker lägga till finns redan`);
		this.emitErrorMessage(this.m);
	}

	public emitErrorMessage(message: object): void {
		this.io.emit('messages', JSON.stringify(message));
	}
}
