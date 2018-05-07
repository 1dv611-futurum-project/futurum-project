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
import MailReciever from '../handlers/email/tools/MailReciever';
import Message from '../handlers/socket/models/Message';

/**
 * Express app.
 */
class App {
  private static DB_CONNECTION = 'mongodb://futurum-db:27017';

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
      this.socketHandler.emitter.emitErrorMessage(new Message('error', 'The database is experienceing problems'));
      console.log(error);
    });
    this.DBHandler.connect(App.DB_CONNECTION);
  }

  private handleIncomingEmails(): void {
    this.emailHandler.Incoming.on(IncomingMailEvent.TICKET, (mail: IReceivedTicket) => {
      this.DBHandler.addOrUpdate(IncomingMailEvent.TICKET, mail, { mailId: mail.mailId })
        .then(() => this.socketHandler.emitter.emitTickets())
        .catch((error) => {
          // TODO: send out email with non database-mail
          this.socketHandler.emitter.emitErrorMessage(new Message('error', 'Could not update database.', mail));
          console.error(error);
        });
    });

    this.emailHandler.Incoming.on(IncomingMailEvent.ANSWER, (mail) => {
      this.DBHandler.addOrUpdate(IncomingMailEvent.ANSWER, mail, { replyId: '<' + mail.inAnswerTo + '>' })
        .then(() => this.socketHandler.emitter.emitTickets())
        .catch((error) => {
          console.error(error);
          // TODO: send out email with non database-answer
          this.socketHandler.emitter.emitErrorMessage(new Message('error', 'Could not update database.', mail));
        });
    });

    this.emailHandler.Incoming.on(IncomingMailEvent.FORWARD, (mail) => {
      console.log('Got mail not in whitelist:');
      console.log(mail);
      console.log('forwarding the mail');
      const forward = {from: mail.from.email, body: mail.messages[0].body, subject: mail.title};
      this.emailHandler.Outgoing.forward(forward, mail.mailID, process.env.IMAP_FORWARDING_ADDRESS)
      .then(() => {
        console.log('mail is forwarded');
        // TODO: send out message to client of forward?
      })
      .catch((error) => {
        this.socketHandler.emitter.emitErrorMessage(new Message('error', 'Could not forward not whitelist-email.', mail));
        console.log(error);
      });
      console.log('emit forward to client?');
    });

    this.emailHandler.Incoming.on(IncomingMailEvent.UNAUTH, (payload) => {
      console.log('Got unauth:');
      console.log(payload);
      console.log('We are missing authorization details for the email, should direct user to auth-route?.');
    });

    this.emailHandler.Incoming.on(IncomingMailEvent.MESSAGE, (message) => {
      console.log('imap connection is probably going to go down in a calculated way. Action?:');
      console.log(message);
      console.log('Make call to ws to send notification of message.');
    });

    this.emailHandler.Incoming.on(IncomingMailEvent.TAMPER, (message) => {
      this.socketHandler.emitter.emitErrorMessage(new Message('error', 'Got tamper message, means emails are being accesses externally and possible reload should happen:'));
    });

    this.emailHandler.Incoming.on(IncomingMailEvent.ERROR, (error) => {
      this.socketHandler.emitter.emitErrorMessage(new Message('error', 'Email error.'));
      console.log('Possibly make call to email module to email the error to different email address:');
      // TODO: send error to email:
      // EmailHandler.Outgoing.send({to: 'dev@futurumdigital.se', subject: 'error', body: 'Error'})
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
