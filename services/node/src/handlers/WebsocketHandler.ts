/**
 * Handles the websocket connection against the client.
 */

// Imports.
const io = require('socket.io')({ path: '/socket' });

/**
 * Handles the connection.
 */
class WebsocketHandler {

<<<<<<< HEAD
  private io: Socket;
  private port = 3001;

  constructor() {
    this.io = io;
  }

  /**
   * Starts the socket connection
   */
  public listen(port, callback): void {
    this.port = port || this.port;

    this.io.listen(port);
    this.io.on('connection', (socket: any) => {
      console.log('Connected client on port %s.', this.port);
      io.to(socket.id).emit('socket', { id: socket.id });

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
=======
    private io: Socket;
    private port = 3001;

    constructor() {
        this.io = io;
    }

    /**
     * Starts the socket connection
     */
    public listen(port, callback): void {
        this.port = port || this.port;

        this.io.listen(port);
        this.io.on('connection', (socket: any) => {
            console.log('Connected client on port %s.', this.port);
            io.to(socket.id).emit('socket', { id: socket.id });

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
    public emit(data: Array<Object>): void{
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
>>>>>>> client-ws
    }
  }

  private originIsAllowed(origin): boolean {
    // put logic here to detect whether the specified origin is allowed.
    return true;
  }
}

// Exports.
export default new WebsocketHandler();
