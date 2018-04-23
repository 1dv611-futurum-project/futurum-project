/**
 * Handles the websocket connection against the client.
 */

// Imports.
import * as SocketIo from 'socket.io';

/**
 * Handles the connection.
 */
export default class Pusher {

  private socket: SocketIo.Server;

  constructor(socket: SocketIo.Server) {
    this.socket = socket;
  }

  /**
   * Emits data to the server on ticket channels.
   */
  public emitTicket(ticket: object): void {
    this.socket.emit('ticket', JSON.stringify(ticket));
  }

  /**
   * Emits data to the server on ticket channels.
   */
  public emitAllTickets(tickets: object[]): void {
    this.socket.emit('tickets', JSON.stringify(tickets));
  }

  /**
   * Emits data to the server on customer channels.
   */
  public emitAllCustomers(customer: object[]): void {
    this.socket.emit('customers', JSON.stringify(customer));
  }

  /**
   * Emits data to the server on settings channels.
   */
  public emitSettings(settings: object[]): void {
    this.socket.emit('settings', JSON.stringify(settings));
  }
}
