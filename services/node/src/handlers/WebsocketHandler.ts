/**
 * Handles the websocket connection against the client.
 */

// Imports.
import * as SocketIo from 'socket.io';

/**
 * Handles the connection.
 */
class WebsocketHandler {

  private static readonly PORT: number = 3001;
  private socket: SocketIo.Server;
  private port: string | number;

  constructor() {
    this.config();
    this.sockets();
    this.listen(3001, () => {const lat = 0; } );
  }

  private config(): void {
    // this.port = process.env.PORT || WebsocketHandler.PORT;
    this.port = WebsocketHandler.PORT;
  }

  private sockets(): void {
    this.socket = SocketIo({ path: '/socket' });
  }

  /**
   * Starts the socket connection
   */
  public listen(port, callback): void {
    this.port = port || this.port;

    this.socket.listen(port);
    this.socket.on('connection', (socket: any) => {
      console.log('Connected client on port %s.', this.port);
      this.socket.to(socket.id).emit('socket', { id: socket.id });

      /**
       * disconnect
       */
      this.socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
    callback();
  }

  /**
   * Emits data to the server on ticket channels.
   */
  public emitTicket(ticket: any): void {
    try {
      this.socket.emit('ticket', JSON.stringify(ticket));
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Emits data to the server on customer channels.
   */
  public emitCustomer(customer: object): void {
    try {
      this.socket.emit('customer', JSON.stringify(customer));
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Emits data to the server on settings channels.
   */
  public emitSettings(settings: object): void {
    try {
      this.socket.emit('settings', JSON.stringify(settings));
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Emits data to all ticket listeners.
   */
  public ticket(callback: any ): void {
    this.socket.on('ticket', callback );
  }

  /**
   * Emits data to all customer listeners.
   */
  public customer(callback: any ): void {
    this.socket.on('customer', callback);
  }

  /**
   * Emits data to all settings listeners.
   */
  public settings(callback: any ): void {
    this.socket.on('customer', callback);
  }

  private originIsAllowed(origin): boolean {
    // put logic here to detect whether the specified origin is allowed.
    return true;
  }
}

// Exports.
export default new WebsocketHandler();
