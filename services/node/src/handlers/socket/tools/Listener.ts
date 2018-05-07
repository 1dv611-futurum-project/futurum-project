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

/**
 * Handles the connection.
 */
export default class Listener {
  private io: SocketIo.Server;
  private db: any;
  private mailSender: any;

  constructor(io: SocketIo.Server, db: any, mailSender: any) {
    this.io = io;
    this.db = db;
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
            .catch((error: any) => { console.error(error); });
        break;
      case TicketEvent.STATUS:
        this.db.addOrUpdate('ticket', ticket, { ticketId: ticket.ticketId })
            .then((payload: any) => this.mailSender.sendStatusUpdate(payload, data.send))
            .catch((error: any) => { console.error(error); });
        break;
      case TicketEvent.MESSAGE:
        this.db.getOne('ticket', { ticketId: ticket.ticketId })
            .then((payload: any) => {
              payload.body.push(ticket.body[ticket.body.length - 1]);
              return this.mailSender.sendMessageUpdate(payload);
            })
            .then((payload: any) => {
              ticket.replyId.push(payload);
              this.db.addOrUpdate('ticket', ticket, { ticketId: ticket.ticketId });
            })
            .catch((error: any) => { console.error(error); });
        break;
      }
    });
  }

  /**
   * Listens for customer-events.
   */
  private customerListener() {
    this.io.on('customers', (event: string, customer: any) => {
      const email = Array.isArray(customer.email) ? customer.email : [customer.email];
      customer.email = email;

      switch (event) {
      case CustomerEvent.ADD:
        this.db.addOrUpdate('customer', customer)
            .catch((error: any) => { console.error(error); });
        break;
      case CustomerEvent.EDIT:
        this.db.addOrUpdate('customer', customer, { email })
            .catch((error: any) => { console.error(error); });
        break;
      case CustomerEvent.DELETE:
        this.db.removeOne('customer', { _id: customer._id })
            .catch((error: any) => { console.error(error); });
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
