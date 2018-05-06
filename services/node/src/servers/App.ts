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
import IMAPHandler from '../handlers/email/IMAPHandler';

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

  constructor() {
    this.express = express();
    this.mainRouter = mainRouter;
    this.authRouter = authRouter;
    this.DBHandler = new DBHandler(new DBConnection());
    this.socketHandler = new SocketHandler(this.DBHandler);
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
    this.express.use(middleware.updateIMAPConnection());
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
      // TODO: Send out email on database error
      console.log(error);
    });
    this.DBHandler.connect(App.DB_CONNECTION);
  }

  private handleIncomingEmails(): void {
    EmailHandler.Incoming.on(IncomingMailEvent.TICKET, (mail: IReceivedTicket) => {
      this.DBHandler.addOrUpdate(IncomingMailEvent.TICKET, mail, { mailId: mail.mailId })
        .then(() => this.socketHandler.emitter.emitTickets())
        .catch((error) => { console.error(error); });
    });

    EmailHandler.Incoming.on(IncomingMailEvent.ANSWER, (mail) => {
      console.log('Got answer on existing ticket:');
      console.log(mail);
      // TODO: Lös detta med mailIDs och references
      /*this.DBHandler.addOrUpdate(IncomingMailEvent.TICKET, mail, { mailId: mail.inAnswerTo })
        .then(() => this.socketHandler.emitter.emitTickets())
        .catch((error) => { console.error(error); });*/
    });

    EmailHandler.Incoming.on(IncomingMailEvent.FORWARD, (mail) => {
      console.log('Got mail not in whitelist:');
      console.log(mail);
      console.log('forwarding the mail');
      const forward = {from: mail.from.email, body: mail.messages[0].body, subject: mail.title};
      EmailHandler.Outgoing.forward(forward, mail.mailID, process.env.IMAP_FORWARDING_ADDRESS)
      .then(() => {
        console.log('mail is forwarded');
      })
      .catch((error) => {
        console.log('could not forward');
        console.log(error);
      });
      console.log('emit forward to client?');
    });

    EmailHandler.Incoming.on(IncomingMailEvent.UNAUTH, (payload) => {
      console.log('Got unauth:');
      console.log(payload);
      console.log('We are missing authorization details for the email, should direct user to auth-route?.');
    });

    EmailHandler.Incoming.on(IncomingMailEvent.MESSAGE, (message) => {
      console.log('imap connection is probably going to go down in a calculated way. Action?:');
      console.log(message);
      console.log('Make call to ws to send notification of message.');
    });

    EmailHandler.Incoming.on(IncomingMailEvent.TAMPER, (message) => {
      console.log('Got tamper message, means emails are being accesses externally and possible reload should happen:');
      console.log(message);
      console.log('Make call to ws to send notification of tamper.');
    });

    EmailHandler.Incoming.on(IncomingMailEvent.ERROR, (error) => {
      console.log('Got error:');
      console.log(error);
      console.log('Make call to ws to send notification of error.');
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
