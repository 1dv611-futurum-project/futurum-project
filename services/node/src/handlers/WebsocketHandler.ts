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
  private io: SocketIo.Server;
  private port: string | number;

  constructor() {
    this.config();
    this.sockets();
  }

  private config(): void {
    this.port = process.env.PORT || WebsocketHandler.PORT;
  }

  private sockets(): void {
    this.io = SocketIo({ path: '/socket' });
  }

  /**
   * Starts the socket connection
   */
  public listen(port, callback): void {
    this.port = port || this.port;

    this.io.listen(port);
    this.io.on('connection', (socket: any) => {
      console.log('Connected client on port %s.', this.port);
      this.io.to(socket.id).emit('socket', { id: socket.id });

      socket.on('message', (m: any) => {
        console.log('[server](message): %s', JSON.stringify(m));
        this.io.emit('message', m);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
    callback();
  }

  /**
   * Emits data to the client on all channels.
   */
  public emit(data: object[]): void {
    try {
      // Logic to see if socket is connected?
      this.io.emit('socket', JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  }

  private originIsAllowed(origin): boolean {
    // put logic here to detect whether the specified origin is allowed.
    return true;
  }
}

// Exports.
export default new WebsocketHandler();
