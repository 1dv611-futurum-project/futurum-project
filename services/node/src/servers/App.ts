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
          // TODO: send out email with non-database-mail
          this.socketHandler.emitter.emitErrorMessage(new Message('error', 'Could not update database.', mail));
          console.error(error);
        });
    });

    this.emailHandler.Incoming.on(IncomingMailEvent.ANSWER, (mail) => {
      this.DBHandler.addOrUpdate(IncomingMailEvent.ANSWER, mail, { replyId: '<' + mail.inAnswerTo + '>' })
        .then(() => Promise.resolve()) // TODO: Emit answer note to client
        .then(() => this.socketHandler.emitter.emitTickets())
        .catch((error) => {
          console.error(error);
          // TODO: send out email with non-database-answer
          this.socketHandler.emitter.emitErrorMessage(new Message('error', 'Could not update database.', mail));
        });
    });

    this.emailHandler.Incoming.on(IncomingMailEvent.FORWARD, (mail) => {
      const forward = {from: mail.from.email, body: mail.body[0].body, subject: mail.title};
      this.emailHandler.Outgoing.forward(forward, mail.mailID, process.env.IMAP_FORWARDING_ADDRESS)
      .then(() => {
        console.log('mail is forwarded');
        // TODO: send out message to client of forward?
      })
      .catch((error) => {
        // TODO: Email somewhere else about failed forward
        const message = 'Could not forward not whitelist-email.';
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
      // TODO: send error to email
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
    // TODO: Handle errors instead of pushing all of them out to client
    if (err.name === 'UnauthorizedError') {
      return res.redirect('/node/auth/google');
    }

    res.status(500).send({
      success: false,
      message: err.stack
    });
  }
}

// Exports.
export default new App().express;
