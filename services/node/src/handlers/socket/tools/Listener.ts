/**
 * Handles the websocket connection against the client.
 */

// Imports.
import * as SocketIo from 'socket.io';

import { TicketEvent } from '../models/TicketEvent';
import { AssigneeEvent } from '../models/AssigneeEvent';
import { CustomerEvent } from '../models/CustomerEvent';
import { SettingEvent } from '../models/SettingEvent';
import { MessageEvent } from '../models/MessageEvent';
import Message from '../models/Message';

/**
 * Handles the connection.
 */
export default class Listener {
  private io: SocketIo.Server;
  private db: any;
  private emitter: any;
  private mailSender: any;

  constructor(io: SocketIo.Server, db: any, mailSender: any, emitter: any) {
    this.io = io;
    this.db = db;
    this.emitter = emitter;
    this.mailSender = mailSender;
  }

  public startListeners() {
    this.ticketListener();
    this.customerListener();
    this.settingsListener();
  }

  private ticketListener() {
    this.io.on('tickets', (event: string, data: any) => {
      const ticket = data.ticket;
      switch (event) {
      case TicketEvent.ASSIGNEE:
        this.db.addOrUpdate('ticket', ticket, { ticketId: ticket.ticketId })
            .catch((error: any) => {
              const message = new Message('error', 'Failed to update assignee in the database');
              this.emitter.emitErrorMessage(message);
            });
        break;
      case TicketEvent.STATUS:
        this.db.addOrUpdate('ticket', ticket, { ticketId: ticket.ticketId })
            .then((payload: any) => this.mailSender.sendStatusUpdate(payload, data.send))
            .then((payload: any) => {
              ticket.replyId.push(payload);
              this.db.addOrUpdate('ticket', ticket, { ticketId: ticket.ticketId });
            })
            .catch((error: any) => {
              const errorMessage = (error.name === 'GmailError')
                                  ? error.message
                                  : 'Failed to update status in database, and send to customer.';
              const message = new Message('error', errorMessage);
            });
        break;
      case TicketEvent.MESSAGE:
        this.db.getOne('ticket', { ticketId: ticket.ticketId })
            .then((payload: any) => {
              const newMessage = ticket.body[ticket.body.length - 1];
              newMessage.fromName = payload.assignee ? payload.assignee.name || 'Futurum Digital' : 'Futurum Digital';
              ticket.body[ticket.body.length - 1] = newMessage;
              payload.body.push(newMessage);
              return this.mailSender.sendMessageUpdate(payload);
            })
            .then((payload: any) => {
              ticket.replyId.push(payload);
              this.db.addOrUpdate('ticket', ticket, { ticketId: ticket.ticketId });
            })
            .catch((error: any) => {
              const errorMessage = (error.name === 'GmailError')
                                  ? error.message
                                  : 'Failed to update email-thread in database, and send to customer.';
              const message = new Message('error', errorMessage);
              this.emitter.emitErrorMessage(message);
            });
        break;
      case TicketEvent.READ:
        this.db.addOrUpdate('ticket', ticket, { ticketId: ticket.ticketId })
            .catch((error: any) => {
              const message = new Message('error', 'Failed to end the notification that the message is read');
              this.emitter.emitErrorMessage(message);
            });
        break;
      }
    });
  }

  /**
   * Listens for customer-events.
   */
  private customerListener() {
    this.io.on('customers', (event: string, customer: any) => {
      const email = Array.isArray(customer.email) ? customer.email[0] : customer.email;
      customer.email = email;

      switch (event) {
      case CustomerEvent.ADD:
        this.db.getOne('customer', { email })
        .then((cust) => {
          if (!cust) {
            this.db.addOrUpdate('customer', customer, { email });
          }
        })
        .catch((error: any) => {
          const message = new Message('error', 'Failed to add customer to database.');
          this.emitter.emitErrorMessage(message);
        });
        break;
      case CustomerEvent.EDIT:
        this.db.addOrUpdate('customer', customer, { email })
        .catch((error: any) => {
          const message = new Message('error', 'Failed to edit customer in database.');
          this.emitter.emitErrorMessage(message);
        });
        break;
      case CustomerEvent.DELETE:
        this.db.removeOne('customer', { _id: customer._id })
        .catch((error: any) => {
          const message = new Message('error', 'Failed to remove customer from database.');
          this.emitter.emitErrorMessage(message);
        });
        break;
      }
    });
  }

  /**
   * Listens for assignee-events.
   */
  private assigneeListener() {
    this.io.on('assignees', (event: string, assignee: any) => {
      const email = Array.isArray(assignee.email) ? assignee.email[0] : assignee.email;
      assignee.email = email;

      switch (event) {
      case AssigneeEvent.ADD:
        this.db.getOne('assignee', { email })
        .then((cust) => {
          if (!cust) {
            this.db.addOrUpdate('assignee', assignee, { email });
          }
        })
        .catch((error: any) => {
          const message = new Message('error', 'Failed to add assignee to database.');
          this.emitter.emitErrorMessage(message);
        });
        break;
      case AssigneeEvent.EDIT:
        this.db.addOrUpdate('assignee', assignee, { email })
        .catch((error: any) => {
          const message = new Message('error', 'Failed to edit assignee in database.');
          this.emitter.emitErrorMessage(message);
        });
        break;
      case AssigneeEvent.DELETE:
        this.db.removeOne('assignee', { _id: assignee._id })
        .catch((error: any) => {
          const message = new Message('error', 'Failed to remove assignee from database.');
          this.emitter.emitErrorMessage(message);
        });
        break;
      }
    });
  }

  /**
   * Listens for message-events.
   */
  private messageListener() {
    this.io.on('messages', (event: string, message: any) => {
      switch (event) {
      case MessageEvent.SUCCESS:
        console.log(message);
        break;
      case MessageEvent.ERROR:
        console.log(message);
        break;
      default:
        console.error('Wrong eventname from client-socket');
        break;
      }
    });
  }

  private settingsListener() {
    this.io.on('settings', (event: string, data: any) => {
      const setting = data.setting;
      switch (event) {
      case SettingEvent.UPDATE:
        // TODO: add settings to db
        break;
      }
    });
  }
}
