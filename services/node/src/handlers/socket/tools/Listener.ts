/**
 * Handles the websocket connection against the client.
 */

// Imports.
import * as SocketIo from 'socket.io';
import MailSender from './MailSender';

import { TicketEvent } from '../models/TicketEvent';
import { AssigneeEvent } from '../models/AssigneeEvent';
import { CustomerEvent } from '../models/CustomerEvent';
import { SettingEvent } from '../models/SettingEvent';

/**
 * Handles the connection.
 */
export default class Listener {
  private io: SocketIo.Server;
  private db: any;

  constructor(io: SocketIo.Server, db: any) {
    this.io = io;
    this.db = db;
  }

  public startListeners() {
    this.ticketListener();
    this.customerListener();
    this.settingsListener();
  }

  private ticketListener() {
    this.io.on('tickets', (event: string, data: any) => {
      const ticket = data.ticket;
      console.log(data.ticket);
      switch (event) {
      case TicketEvent.ASSIGNEE:
        this.db.addOrUpdate('ticket', ticket, { ticketId: ticket.id })
            .catch((error: any) => { console.error(error); });
        break;
      case TicketEvent.STATUS:
        this.db.addOrUpdate('ticket', ticket, { ticketId: ticket.id })
            .then((payload: any) => MailSender.sendStatusUpdate(payload, data.send))
            .catch((error: any) => { console.error(error); });
        break;
      case TicketEvent.MESSAGE:
        this.db.addOrUpdate('ticket', ticket, { ticketId: ticket.id })
            .then((payload: any) => MailSender.sendMessageUpdate(payload))
            .catch((error: any) => { console.error(error); });
        break;
      }
    });
  }

  private customerListener() {
    this.io.on('customers', (event: string, data: any) => {
      const customer = data.customer;
      switch (event) {
      case CustomerEvent.ADD:
        this.db.addOrUpdate('customer', customer)
            .catch((error: any) => { console.error(error); });
        break;
      case CustomerEvent.EDIT:
        this.db.addOrUpdate('customer', customer)
            .catch((error: any) => { console.error(error); });
        break;
      case CustomerEvent.DELETE:
        this.db.removeOne('customer', { _id: customer._id })
            .catch((error: any) => { console.error(error); });
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
