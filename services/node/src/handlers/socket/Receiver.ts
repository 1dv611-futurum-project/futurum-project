/**
 * Handles the websocket connection against the client.
 */

// Imports.
import * as SocketIo from 'socket.io';

/**
 * Handles the connection.
 */
export default class Receiver {

  private socket: SocketIo.Server;

  constructor(socket: SocketIo.Server) {
    this.socket = socket;
  }

  /**
   * Emits data to all ticket listeners.
   */
  public onTicket(callback: any ): void {
    this.socket.on('ticket', callback );
  }

  /**
   * Emits data to all customer listeners.
   */
  public onCustomer(callback: any ): void {
    this.socket.on('customer', callback);
  }

  /**
   * Emits data to all settings listeners.
   */
  public onSettings(callback: any ): void {
    this.socket.on('settings', callback);
  }
}
