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
  private socket: any;
  private db: any;
  private emitter: any;
  private mailSender: any;
  private mailReciever: any;

  public listen(socket: any, db: any, mailSender: any, mailReciever: any) {
    this.socket = socket;
    this.db = db;
    this.mailSender = mailSender;
    this.mailReciever = mailReciever;

    this.incomingMailListener();
    this.reloadEventListener();
    this.errorListener();
  }

  private incomingMailListener() {
    this.mailReciever.on(IncomingMailEvent.TICKET, (mail: IReceivedTicket) => {
      this.db.addOrUpdate(IncomingMailEvent.TICKET, mail, { mailId: mail.mailId })
        .then(() => this.socket.emitter.emitTickets())
        .catch((error) => {
          const failSubject = 'Ticket-system failed to handle incoming ticket: ' + mail.title;
          const forward = {from: mail.from.email, body: mail.body[0].body, subject: failSubject};
          this.mailSender.forward(forward, mail.mailId, process.env.IMAP_FORWARDING_ADDRESS);
          this.socket.emitter.emitErrorMessage(new Message('error', 'Could not update database.', mail));
          console.error(error);
        });
    });

    this.mailReciever.on(IncomingMailEvent.ANSWER, (mail) => {
      const query = { $or: [ { replyId: '<' + mail.inAnswerTo + '>' }, { mailId: mail.inAnswerTo} ]};
      this.db.addOrUpdate(IncomingMailEvent.ANSWER, mail, query)
        .then(() => {
          // TODO: Emit answer note to client with  this.socket.emitter.[vettigEmitFunktion], kanske emitSuccessMessage?
          console.log('here should be an emit to the client that an answer has been recieved');
          Promise.resolve();
        })
        .then(() => this.socket.emitter.emitTickets())
        .catch((error) => {
          console.error(error);
          const failSubject = 'Ticket-system failed to handle incoming thread with email from ' + mail.fromName;
          const forward = {from: mail.fromAddress, body: mail.body, subject: failSubject};
          this.mailSender.forward(forward, mail.mailId, process.env.IMAP_FORWARDING_ADDRESS);
          const message = failSubject;
          this.socket.emitter.emitErrorMessage(new Message('error', message, mail));
        });
    });

    this.mailReciever.on(IncomingMailEvent.FORWARD, (mail) => {
      const forward = {from: mail.from.email, body: mail.body[0].body, subject: mail.title};
      this.mailSender.forward(forward, mail.mailId, process.env.IMAP_FORWARDING_ADDRESS)
      .then(() => {
        console.log('Here should be an emit to the client that a mail has been forwarded, maybe?');
        // TODO: emit message to client of forward?
      })
      .catch((error) => {
        console.error(error);

        const message = 'Could not forward non-whitelist-email.';
        this.socket.emitter.emitErrorMessage(new Message('error', message, mail));

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
    this.mailReciever.on(IncomingMailEvent.ERROR, (error) => {
      const message = 'Email error. Reload page and double check emails externally.';
      this.socket.emitter.emitErrorMessage(new Message('error', message));

      const errorSubject = 'Error: Something is going wrong with the ticket-system handling incoming emails.';
      const errorBody = 'Ticket-system is recieving errors from incoming emails.' +
      'Please reload the app-page or restart the server and double check emails externally.';
      const to = process.env.IMAP_ERROR_ADDRESS || process.env.IMAP_FORWARDING_ADDRESS;
      const send = {body: errorBody, subject: errorSubject, to};

      this.mailSender.send(send);
    });
  }
}
