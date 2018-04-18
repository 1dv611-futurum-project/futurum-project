/**
 * Handles the websocket connection against the client.
 */

// Imports.
import * as socketIo from 'socket.io';

/**
 * Handles the connection.
 */
class WebsocketHandler {

  private io: socketIo.Server;
  private port = 3001;

  constructor() {
    this.io = socketIo({ path: '/socket' });
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
