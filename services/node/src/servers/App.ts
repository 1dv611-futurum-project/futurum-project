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
import IReceivedTicket from './../handlers/email/interfaces/IReceivedTicket';
import { IncomingMailEvent } from './../handlers/email/events/IncomingMailEvents';
import Ticket from './../models/Ticket';
import Mail from './../models/Mail';
import Email from './../handlers/email/Email';
import IMAPHandler from '../handlers/email/IMAPHandler';

const mockData = [
  {
    type: 'ticket',
    id: 3,
    status: 2,
    assignee: 'Anton Myrberg',
    mailID: 'CACGfpvHcD9tOcJz8YT1CwiEO36VHhH1+-qXkCJhhaDQZd6-JKA@mail.gmail.com',
    created: '2018-04-17T17:56:58.000Z',
    title: 'Ett test igen',
    from: {
      name: 'Dev Devsson',
      email: 'dev@futurumdigital.se'
    },
    messages: [
      {
        received: '2018-04-17T17:56:58.000Z',
        body: 'Vi har mottagit ditt meddelande och återkommer inom kort. Mvh Anton Myrberg',
        fromCustomer: false
      },
      {
        received: '2018-04-17T17:56:58.000Z',
        body: 'adfafdasfa ',
        fromCustomer: true
      }
    ]
  },
  {
    type: 'ticket',
    id: 12,
    status: 1,
    assignee: null,
    mailID: 'CACGfpvHcD9tOcJz8YT1CwiEO36VHhH1+-qXkCJhhaDQZd6-JKA@mail.gmail.com',
    created: '2018-04-17T17:56:58.000Z',
    title: 'Vi har ett problem',
    from: {
      name: 'Dev Devsson',
      email: 'dev@futurumdigital.se'
    },
    messages: [
      {
        received: '2018-04-17T17:56:58.000Z',
        body: 'adfafdasfa ',
        fromCustomer: true
      }
    ]
  },
  {
    type: 'ticket',
    id: 6,
    status: 2,
    assignee: 'Sebastian Borgstedt',
    mailID: 'CACGfpvHcD9tOcJz8YT1CwiEO36VHhH1+-qXkCJhhaDQZd6-JKA@mail.gmail.com',
    created: '2018-04-17T17:56:58.000Z',
    title: 'Nu har det blivit tokigt',
    from: {
      name: 'Dev Devsson',
      email: 'dev@futurumdigital.se'
    },
    messages: [
      {
        received: '2018-04-17T17:56:58.000Z',
        body: 'adfafdasfa ',
        fromCustomer: true
      }
    ]
  }
] as object[];

const tickArr = [];

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
    this.handleErrors();
    this.handleIncomingEmails();
    this.handleDB();
    this.listenSocket();
    // this.DBActions();
  }

  private DBActions(): void {
    tickArr.push(this.createNewTicket(mockData[0], this.createNewMails(mockData[0])));
    tickArr.push(this.createNewTicket(mockData[1], this.createNewMails(mockData[1])));
    tickArr.push(this.createNewTicket(mockData[2], this.createNewMails(mockData[2])));
    this.DBHandler.createNewFromType('ticket', tickArr[0]);
    this.DBHandler.createNewFromType('ticket', tickArr[1]);
    this.DBHandler.createNewFromType('ticket', tickArr[2]);
    // this.DBHandler.removeAll('ticket', {});
  }

  private listenSocket() {
    this.websocketHandler.onSocket( (socket) => {
      this.DBHandler.getAll('ticket', {}).then( (tickets) => {
        const tick = tickets;
        this.websocketHandler.emitTickets(tickets);
      });

      socket.on('tickets', (event: string, data: any) => {
        const ticket = this.createNewTicket(data, this.createNewMails(data));
        switch (event) {
        case 'ticket_assignee':
          try {
            this.DBHandler.getOne('ticket', { ticketId: data.id } ).then((tick) => {
              if (tick) {
                this.DBHandler.addOrUpdate('ticket', ticket, { ticketId: data.id });
                // todo: get latest server and use Imaphandler.Mailhandler to send mail
              } else {
                // todo: ErrorChannel
              }
            });
          } catch (error) {
            console.error(error);
          }
          break;
        case 'ticket_message':
          try {
            this.DBHandler.getOne('ticket', { ticketId: data.id } ).then((tick) => {
              if (tick) {
                this.DBHandler.addOrUpdate('ticket', ticket, { ticketId: data.id });
                // todo: get latest server and use Imaphandler.Mailhandler to send mail
              } else {
                // todo: ErrorChannel
              }
            });
          } catch (error) {
            console.error(error);
          }
          break;
        case 'ticket_status':
          try {
            this.DBHandler.getOne('ticket', { ticketId: data.id } ).then((tick) => {
              if (tick) {
                this.DBHandler.addOrUpdate('ticket', ticket, { ticketId: data.id });
                // todo: get latest server and use Imaphandler.Mailhandler to send mail
              } else {
                // todo: ErrorChannel
              }
            });
          } catch (error) {
            console.error(error);
          }
          break;
        default:
          break;
        }
      });

      socket.on('assignees', (event: string, assignee: object) => {
        this.DBHandler.addOrUpdate('assignee', { _id: assignee._id });
      });

      socket.on('customers', (event: string, customer: object) => {
        switch (event) {
        case 'customer_add':
          try {
            this.DBHandler.getOne('customer', { _id: customer._id } ).then((c) => {
              if (c) {
                // todo: ErrorChannel
              } else {
                this.DBHandler.addOrUpdate('customer', customer);
                // todo: get latest server and use Imaphandler.Mailhandler to send mail
              }
            });
          } catch (error) {
            console.error(error);
          }
          break;
        case 'customer_edit':
          try {
            this.DBHandler.getOne('customer', { _id: customer._id } ).then((c) => {
              if (c) {
                this.DBHandler.addOrUpdate('customer', customer, { _id: customer._id });
                // todo: get latest server and use Imaphandler.Mailhandler to send mail
              } else {
                // todo: ErrorChannel
              }
            });
          } catch (error) {
            console.error(error);
          }
          break;
        case 'customer_delete':
          try {
            this.DBHandler.getOne('customer', { _id: customer._id } ).then((c) => {
              if (c) {
                this.DBHandler.removeOne('customer', { _id: customer._id });
                this.DBHandler.getOne('customer', { _id: customer._id } ).then((cust) => {
                  if (cust) {
                    // todo: get latest server and use Imaphandler.Mailhandler to send mail
                  } else {
                    // todo: ErrorChannel
                  }
                });
              } else {
                // todo: ErrorChannel
              }
            });
          } catch (error) {
            console.error(error);
          }
          break;
        default:
          break;
        }
      });

      socket.on('settings', (event: string, settings: any) => {
        if (event === 'setting_update') {
          this.DBHandler.addOrUpdate('settings', settings);
        } else {
          // todo: ErrorChannel
        }
      });
    });
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
    this.express.use('/auth', this.authRouter);
    this.express.all('*', this.emptyHandler);
  }

  private handleErrors(): void {
    this.express.use(this.errorHandler);
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

  private createNewMails(mail: any): Mail[] {
    try {
      const mailBodies = [];
      mail.messages.forEach((element) => {
        // todo: ? if not required
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

  private createNewTicket(mail: any, mailBodies: Mail[]): object {
    try {
      // todo: ? if not required
      const ticket = new Ticket({
        ticketId: mail.id,
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
    EmailHandler.Incoming.on(IncomingMailEvent.TICKET, (mail) => {
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

    EmailHandler.Incoming.on(IncomingMailEvent.ANSWER, (mail) => {
      console.log('Got answer on existing ticket:');
      console.log(mail);
      console.log('Make call to database to save the answer.');
      this.DBHandler.addOrUpdate(mail.type, this.createNewMails(mail));
      const ticket = this.DBHandler.getOne(mail.type, this.createNewMails(mail));
      this.websocketHandler.emitTicket(ticket);
      // Emit answer to client
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
