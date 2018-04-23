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
import WebsocketHandler from './../handlers/WebsocketHandler';
import Ticket from './../models/Ticket';
import Mail from './../models/Mail';

/**
 * Express app.
 */
class App {
  public express: Application;
  private mainRouter: Router;
  private authRouter: Router;
  private DBHandler: DBHandler;
  private websocketHandler: WebsocketHandler;

  constructor() {
    this.express = express();
    this.mainRouter = mainRouter;
    this.authRouter = authRouter;
    this.DBHandler = new DBHandler(new DBConnection());
    this.websocketHandler = WebsocketHandler;
    this.middleware();
    this.mountRoutes();
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
    this.express.use(this.errorHandler);
  }

  private mountRoutes(): void {
    this.express.use('/', this.mainRouter);
    this.express.use('/node', this.mainRouter);
    this.express.use('/node/auth', this.authRouter);
    this.express.use('/auth', this.authRouter);
    this.express.all('*', this.emptyHandler);
  }

  private handleDB(): void {
    this.DBHandler.on('ready', () => {
      console.log('Connected to db');
    });

    this.DBHandler.on('error', (error) => {
      console.log('Error in db');
      console.log(error);
    });

    this.DBHandler.on('disconnected', () => {
      console.log('db disconnected');
    });

    this.DBHandler.connect('mongodb://futurum-db:27017');
  }

/*
 * Example email to map to db objects
{ type: 'ticket',
  id: 0,
  status: 0,
  assignee: null,
  mailID: 'CAHm9NZDiA=EYN9N7_r66TFr49ws0JYoEEjXbMU9Y2i4W9w8fug@mail.gmail.com',
  created: 2018-04-21T13:48:01.000Z,
  title: 'master',
  from: { name: 'Johan Söderlund', email: 'js223zs@student.lnu.se' },
  messages: 
    [ { received: 2018-04-21T13:48:01.000Z,
        body: 'are you?\n',
        fromCustomer: true } ] }
*/

/*
      status: {type: Number, default: 0},
  assignee: {type: String, required: false},
  title: {type: String, required: false},
  from: {type: String, required: true},
  customerName: {type: String, required: false},
  body: {type: [], required: true}


  this.received = message.received;
    this.fromCustomer = message.fromCustomer;
    this.body = message.body;
  */

  private createNewMails(mail: object): Mail[] {
    try {
      const mailBodies = [];
      mail.messages.forEach((element) => {
        mailBodies.push(new Mail({
          received: element.received,
          fromCustomer: element.fromCustomer,
          body: element.body}));
      });
      return mailBodies;
    } catch (error) {
      console.error(error);
    }
    return;
  }

  private createNewTicket(mail: object, mailBodies: Mail[]): object {
    try {
      const ticket = new Ticket({
        status: mail.status,
        assignee: mail.assignee,
        title: mail.title,
        from: mail.from.email,
        customerName: mail.from.name,
        body: mailBodies
      });
      return ticket;
    } catch (error) {
      console.error(error);
    }
    return;
  }

  private handleIncomingEmails(): void {
    EmailHandler.Incoming.on('mail', (mail) => {
      console.log('Got new ticket:');
      console.log(mail);

      try {
        const ticket = this.createNewTicket(mail, this.createNewMails(mail));
        this.DBHandler.createNewFromType(mail.type, ticket);
        this.websocketHandler.emitTicket(ticket);
      } catch (error) {
        console.error(error);
      }
    });

    EmailHandler.Incoming.on('answer', (mail) => {
      console.log('Got answer on existing ticket:');
      console.log(mail);
      console.log('Make call to database to save the answer.');
      this.DBHandler.addOrUpdate(mail.type, this.createNewMails(mail));
      const ticket = this.DBHandler.getOne(mail.type, this.createNewMails(mail));
      this.websocketHandler.emitTicket(ticket);
      // Emit answer to client
    });

    EmailHandler.Incoming.on('forward', (mail) => {
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

    EmailHandler.Incoming.on('unauth', (payload) => {
      console.log('Got unauth:');
      console.log(payload);
      console.log('We are missing authorization details for the email, should direct user to auth-route?.');
    });

    EmailHandler.Incoming.on('message', (message) => {
      console.log('imap connection is probably going to go down in a calculated way. Action?:');
      console.log(message);
      console.log('Make call to ws to send notification of message.');
    });

    EmailHandler.Incoming.on('tamper', (message) => {
      console.log('Got tamper message, means emails are being accesses externally and possible reload should happen:');
      console.log(message);
      console.log('Make call to ws to send notification of tamper.');
    });

    EmailHandler.Incoming.on('error', (error) => {
      console.log('Got error:');
      console.log(error);
      console.log('Make call to ws to send notification of error.');
      console.log('Possibly make call to email module to email the error to different email address:');
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
  private errorHandler(err, req: Request, res: Response, next: NextFunction): void {
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
