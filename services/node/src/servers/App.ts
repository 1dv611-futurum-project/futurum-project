/**
 * Application starting point.
 */

// Imports.
import * as express from 'express';
import { Application, Router, Request, Response, NextFunction, Error } from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as jwt from 'express-jwt';
import middleware from './../config/middleware';
import passportStrategies from './../config/passport';
import mainRouter from './../routes/mainRouter';
import authRouter from './../routes/authRouter';
import DBHandler from './../handlers/db/DBHandler';
import DBConnection from './../handlers/db/DBConnection';
import EmailHandler from './../handlers/email/EmailHandler';
import SocketHandler from './../handlers/socket/SocketHandler';
import IReceivedTicket from './../handlers/email/interfaces/IReceivedTicket';
import { IncomingMailEvent } from './../handlers/email/events/IncomingMailEvents';
import Message from '../handlers/socket/models/Message';

/**
 * Express app.
 */
class App {
  private static DB_CONNECTION =  'mongodb://futurum-db:27017';

  public express: Application;
  private mainRouter: Router;
  private authRouter: Router;
  private DBHandler: DBHandler;
  private socketHandler: SocketHandler;
  private emailHandler: EmailHandler;

  constructor() {
    this.express = express();
    this.mainRouter = mainRouter;
    this.authRouter = authRouter;
    this.DBHandler = new DBHandler(new DBConnection());
    this.emailHandler = new EmailHandler(this.DBHandler);
    this.socketHandler = new SocketHandler(this.DBHandler, this.emailHandler);
    this.middleware();
    this.mountRoutes();
    this.handleErrors();
    this.handleIncomingEmails();
    this.handleDB();
  }

  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(cookieParser());
    passportStrategies.make();
    this.express.use(middleware.security());
    this.express.use(middleware.checkConnection());
    this.express.use(middleware.updateIMAPConnection(this.emailHandler));
  }

  private mountRoutes(): void {
    this.express.use('/', this.mainRouter);
    this.express.use('/node', this.mainRouter);
    this.express.use('/node/auth', this.authRouter);
    this.express.all('*', this.emptyHandler);
  }

  private handleErrors(): void {
    this.express.use(this.errorHandler);
  }

  private handleDB(): void {
    this.DBHandler.on('error', (error) => {
      console.error(error);
      if (this.socketHandler.emitter) {
        this.socketHandler.emitter.emitErrorMessage(new Message('error', 'The database is experienceing problems'));
      }
    });
    this.DBHandler.connect(App.DB_CONNECTION);
  }

  private handleIncomingEmails(): void {
    this.emailHandler.Incoming.on(IncomingMailEvent.TICKET, (mail: IReceivedTicket) => {
      this.DBHandler.addOrUpdate(IncomingMailEvent.TICKET, mail, { mailId: mail.mailId })
        .then(() => this.socketHandler.emitter.emitTickets())
        .catch((error) => {
          const failSubject = 'Ticket-system failed to handle incoming ticket: ' + mail.title;
          const forward = {from: mail.from.email, body: mail.body[0].body, subject: failSubject};
          this.emailHandler.Outgoing.forward(forward, mail.mailId, process.env.IMAP_FORWARDING_ADDRESS);
          this.socketHandler.emitter.emitErrorMessage(new Message('error', 'Could not update database.', mail));
          console.error(error);
        });
    });

    this.emailHandler.Incoming.on(IncomingMailEvent.ANSWER, (mail) => {
      const query = { $or: [ { replyId: '<' + mail.inAnswerTo + '>' }, { mailId: mail.inAnswerTo} ]};
      this.DBHandler.addOrUpdate(IncomingMailEvent.ANSWER, mail, query)
        .then(() => Promise.resolve()) // TODO: Emit answer note to client
        .then(() => this.socketHandler.emitter.emitTickets())
        .catch((error) => {
          console.error(error);
          const failSubject = 'Ticket-system failed to handle incoming thread with email from ' + mail.fromAddress;
          const forward = {from: mail.fromAddress, body: mail.body, subject: failSubject};
          this.emailHandler.Outgoing.forward(forward, mail.mailId, process.env.IMAP_FORWARDING_ADDRESS);
          const message = failSubject;
          this.socketHandler.emitter.emitErrorMessage(new Message('error', message, mail));
        });
    });

    this.emailHandler.Incoming.on(IncomingMailEvent.FORWARD, (mail) => {
      const forward = {from: mail.from.email, body: mail.body[0].body, subject: mail.title};
      this.emailHandler.Outgoing.forward(forward, mail.mailId, process.env.IMAP_FORWARDING_ADDRESS)
      .then(() => {
        console.log('mail is forwarded');
        // TODO: emit message to client of forward?
      })
      .catch((error) => {
        const errorSubject = 'Error: Ticket-system failed to forward non-whitelist email from: ' + mail.from.email;
        const errorBody = 'Ticket-system is recieving errors when forwarding emails not in whitelist.' +
        'Please double check the forwarding address you\ve given and double check emails externally.';
        const to = process.env.IMAP_ERROR_ADDRESS || process.env.IMAP_FORWARDING_ADDRESS;
        const send = {body: mail.body[0].body, subject: errorSubject, to};
        this.emailHandler.Outgoing.send(send);
        const message = 'Could not forward non-whitelist-email.';

        this.socketHandler.emitter.emitErrorMessage(new Message('error', message, mail));
        console.log(error);
      });
    });

    this.emailHandler.Incoming.on(IncomingMailEvent.UNAUTH, (payload) => {
      const message = 'User is not authorized, please reload the page to authorize.';
      this.socketHandler.emitter.emitErrorMessage(new Message('error', message));
    });

    this.emailHandler.Incoming.on(IncomingMailEvent.MESSAGE, () => {
      const message = 'Emails are being accesses externally. Possibly reload the page to ensure continued validity.';
      this.socketHandler.emitter.emitErrorMessage(new Message('error', message));
    });

    this.emailHandler.Incoming.on(IncomingMailEvent.TAMPER, () => {
      const message = 'Emails are being accesses externally. Possibly reload the page to ensure continued validity.';
      this.socketHandler.emitter.emitErrorMessage(new Message('error', message));
    });

    this.emailHandler.Incoming.on(IncomingMailEvent.ERROR, (error) => {
      const message = 'Email error. Reload page and double check emails externally.';
      this.socketHandler.emitter.emitErrorMessage(new Message('error', message));

      const errorSubject = 'Error: Something is going wrong with the ticket-system handling incoming emails.';
      const errorBody = 'Ticket-system is recieving errors from incoming emails.' +
      'Please reload the app-page or restart the server and double check emails externally.';
      const to = process.env.IMAP_ERROR_ADDRESS || process.env.IMAP_FORWARDING_ADDRESS;
      const send = {body: errorBody, subject: errorSubject, to};
      this.emailHandler.Outgoing.send(send);
    });
  }

  // 404
  private emptyHandler(req: Request, res: Response, next: NextFunction): void {
    res.status(404).send({
      success: false,
      message: 'Not found'
    });
    return next();
  }

  // 500
  private errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
    // TODO: Handle errors instead of pushing all of them out to client?
    if (err.name === 'UnauthorizedError') {
      return res.redirect('/node/auth/google');
    }

    res.status(500).send({
      success: false,
      message: err.message
    });
  }
}

// Exports.
export default new App().express;
