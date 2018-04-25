/**
 * Handles the websocket connection against the client.
 */
import { Channel } from './Channel';
import { TicketEvent } from '../events/TicketEvent';

/**
 * Handles the connection.
 */
export default class TicketChannel extends Channel {

  public channel = TicketEvent.CHANNEL;

  public onStatus(cb: any) {
    this.listen(cb);
  }

  public onAssignee(cb: any) {
    this.listen(cb);
  }

  public onMail(cb: any) {
    this.listen(cb);
  }

  public emitTicket(ticket: object) {
    this.emit(TicketEvent.TICKET, ticket);
  }

  public emitTickets(tickets: object[]) {
    this.emit(TicketEvent.TICKETS, tickets);
  }
}
