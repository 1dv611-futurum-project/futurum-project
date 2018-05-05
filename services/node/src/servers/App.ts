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
import Email from './../handlers/email/Email';
import IMAPHandler from '../handlers/email/IMAPHandler';



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
  }

  private listenSocket() {
    this.websocketHandler.onSocket( (socket) => {
      this.DBHandler.getAll('ticket', {}).then( (tickets) => {
        console.log('getting tickets');
        this.DBHandler.removeAll('Ticket', {});
        this.websocketHandler.emitTickets(tickets);
      }).catch((error) => {
        console.log('Could not get tickets from DB');
        console.log(error);
      });

      this.DBHandler.getAll('customer', {}).then( (customers) => {
        this.websocketHandler.emitCustomers(customers);
      }).catch((error) => {
        console.log('Could not get customers from DB');
        console.log(error);
      });

      this.DBHandler.getAll('assignee', {}).then( (assignees) => {
        this.websocketHandler.emitAssignees(assignees);
      }).catch((error) => {
        console.log('Could not get customers from DB');
        console.log(error);
      });

      socket.on('tickets', (event: string, ticket: any) => {
        if (!('id' in ticket)) {
          // Errorchannel
          return;
        }

        switch (event) {
        case 'ticket_assignee':
          this.DBHandler.addOrUpdate('ticket', ticket, { ticketId: ticket.id }).then((savedTicket) => {
            if (savedTicket && (savedTicket[0].assignee === ticket.assignee) ) {
              const mailBody = savedTicket[0].assignee + ' har tilldelats ärende med ärendeID: '
              + savedTicket[0].ticketId + '.';
              const mailSubject = 'Kundärende har blivit tilldelat';
              // todo: change to: assigne.email stored in db
              const mail = {from: 'dev@futurumdigital.se', to: 'dev@futurumdigital.se',
                subject: mailSubject, body: mailBody};
              EmailHandler.Outgoing.send(mail)
              .then(() => {
                // Successchannel
              })
              .catch((error) => {
                console.log('could not send mail ticket_assignee');
                console.log(error);
              });
            } else {
              // Errorchannel
            }
          }).catch((error) => {
            console.log('could not update/save ticket with new assignee');
            console.log(error);
          });
          break;
        case 'ticket_message':
          this.DBHandler.addOrUpdate('ticket', ticket, { ticketId: ticket.id }).then((savedTicket) => {
            if (savedTicket &&
              (savedTicket[0].body[savedTicket[0].body.length].body ===
                ticket.messages[ticket.messages.length].body) ) {

              const mailSubject = 'RE: ' + savedTicket[0].title;
              const mail = {from: 'dev@futurumdigital.se', to: savedTicket[0].from,
                subject: mailSubject, body: ticket.messages[ticket.messages.length].body};
              EmailHandler.Outgoing.answer(mail, savedTicket[0].ticketID)
              .then(() => {
                // Successchannel
              })
              .catch((error) => {
                console.log('could not send mail ticket_message');
                console.log(error);
              });
            } else {
              // Errorchannel
            }
          }).catch((error) => {
            console.log('could not update/save ticket with new message');
            console.log(error);
          });
          break;
        case 'ticket_status':
          this.DBHandler.addOrUpdate('ticket', ticket, { ticketId: ticket.id }).then((savedTicket) => {
            if (savedTicket && (savedTicket[0].status === ticket.status) ) {
              const mailBody = 'Status för ärende med ärendeID: '+ savedTicket[0].ticketId + ' har ändrats.';
              const mailSubject = 'Kundärende har fått uppdaterad status';
              // todo: change to: assigne.email stored in db
              const mail = {from: 'dev@futurumdigital.se', to: 'dev@futurumdigital.se',
                subject: mailSubject, body: mailBody};
              EmailHandler.Outgoing.send(mail)
              .then(() => {
                // Successchannel
              })
              .catch((error) => {
                console.log('could not send mail ticket_status');
                console.log(error);
              });
            } else {
              // Errorchannel
            }
          }).catch((error) => {
            console.log('could not update/save ticket with new status');
            console.log(error);
          });
          break;
        default:
          break;
        }
      });

      socket.on('assignees', (event: string, assignee: object) => {
        if ('_id' in assignee) {
          this.DBHandler.addOrUpdate('assignee', assignee, { _id: assignee._id }).then((savedAssignee) => {
            if (savedAssignee) {
              // Successchannel
            } else {
              // Errorchannel
            }
          }).catch((error) => {
            console.log('could edit assignee');
            console.log(error);
          });
        } else {
          this.DBHandler.addOrUpdate('assignee', assignee).then((savedAssignee) => {
            if (savedAssignee) {
              // Successchannel
            } else {
              // Errorchannel
            }
          }).catch((error) => {
            console.log('could not add new assignee');
            console.log(error);
          });
        }
      });

      socket.on('customers', (event: string, customer: object) => {
        switch (event) {
        case 'customer_add':
          if ('_id' in customer) {
            // todo: ErrorChannel
          } else {
            this.DBHandler.addOrUpdate('customer', customer).then((savedCustomer) => {
              if (savedCustomer) {
                // Successchannel
              } else {
                // Errorchannel
              }
            }).catch((error) => {
              console.log('could not add new customer');
              console.log(error);
            });
          }
          break;
        case 'customer_edit':
          if ('_id' in customer) {
            this.DBHandler.addOrUpdate('customer', customer, { _id: customer._id }).then((savedCustomer) => {
              if (savedCustomer) {
                // Successchannel
              } else {
                // Errorchannel
              }
            }).catch((error) => {
              console.log('could not edit and save customer');
              console.log(error);
            });
          } else {
            // todo: ErrorChannel
          }
          break;
        case 'customer_delete':
          if ('_id' in customer) {
            this.DBHandler.removeOne('customer', { _id: customer._id }).then((removedCustomer) => {
              if (removedCustomer) {
                // Successchannel
              } else {
                // Errorchannel
              }
            }).catch((error) => {
              console.log('could not delete customer');
              console.log(error);
            });
          } else {
            // todo: ErrorChannel wrong eventname
          }
          break;
        default:
          break;
        }
      });

      socket.on('settings', (event: string, settings: any) => {
        if (event === 'setting_update') {
          this.DBHandler.addOrUpdate('settings', settings).then( (savedSettings) => {
            if (savedSettings) {
              // Successchannel
            } else {
              // Errorchannel
            }
          }).catch((error) => {
            console.log('could not save settings');
            console.log(error);
          });
        } else {
          // todo: ErrorChannel wrong event-name
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

  private handleIncomingEmails(): void {
    EmailHandler.Incoming.on(IncomingMailEvent.TICKET, (mail) => {
      console.log('Got new ticket:');
      console.log(mail);
      this.DBHandler.addOrUpdate(IncomingMailEvent.TICKET, mail).then((savedTicket) => {
        console.log(savedTicket)
        if (savedTicket &&
          (savedTicket[0].body[savedTicket[0].body.length - 1].body ===
          mail.messages[mail.messages.length - 1].body) ) {
          this.websocketHandler.emitTickets(savedTicket[0]);
        } else {
          // Errorchannel db-client mismatch
        }
      }).catch((error) => {
        console.log('could not save incoming new mail as ticket');
        console.log(error);
      });
    });

    EmailHandler.Incoming.on(IncomingMailEvent.ANSWER, (mail) => {
      console.log('Got answer on existing ticket:');
      console.log(mail);
      // todo: force mail param to contain ticketId or _id
      this.DBHandler.addOrUpdate(IncomingMailEvent.ANSWER, mail, {mailId: mail.inReplyTo}).then((savedTicket) => {
        if (savedTicket &&
          (savedTicket.body[savedTicket.body.length].body ===
          mail.messages[mail.messages.length].body) ) {
          this.websocketHandler.emitTickets(savedTicket);
        } else {
          // Errorchannel
        }
      }).catch((error) => {
        console.log('could not save incoming new mail as ticket');
        console.log(error);
      });
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
