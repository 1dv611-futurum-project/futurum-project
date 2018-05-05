/**
 * Handles the websocket connection against the client.
 */

// Imports.
import * as SocketIo from 'socket.io';
import * as SocketIoJwt from 'socketio-jwt-decoder';

/**
 * Handles the connection.
 */
class WebsocketHandler {

  private static readonly PORT: number = 3001;
  private static readonly PATH: string = '/socket';
  private socket: SocketIo.Server;
  private port: string | number;

  constructor() {
    this.config();
    this.authorize();
    this.listen();
    this.onConnect();
  }

  private config(): void {
    this.socket = SocketIo({ path: WebsocketHandler.PATH });
  }

  private authorize(): void {
    this.socket.use(SocketIoJwt.authorize({
      secret: 'secret',
      handshake: true
    }));
  }

  private listen(): void {
    this.socket.listen(WebsocketHandler.PORT);
  }

  private onConnect() {
    this.socket.on('connection', (socket: any) => {
      // Incoming data:
      // eventType + ticket
      socket.on('tickets', (event: string, data: any) => {
        console.log({ event, data });
      });

      // Incoming data:
      // eventType + customer
      socket.on('customers', (event: string, data: any) => {
        console.log({ event, data });
      });

      // Incoming data:
      // eventType + all settings
      socket.on('settings', (event: string, data: any) => {
        console.log({ event, data });
      });

      const exp = new Date(socket.decoded_token.exp * 1000).getTime() - new Date().getTime();
      setTimeout(() => {
        socket.emit('expired');
        socket.disconnect();
      }, exp);
    });
  }

  public onSocket(callback: any) {
    this.socket.on('connection', (socket: any) => {
      callback(socket);
    });
  }

  /**
   * Emits data to the server on ticket channels.
   */
  public emitTicket(ticket: object): void {
    this.socket.emit('tickets', JSON.stringify(ticket));
  }

  /**
   * Emits data to the server on ticket channels.
   */
  public emitTickets(tickets: object[]): void {
    try {
      console.log(tickets)
      this.socket.emit('tickets', JSON.stringify(tickets));
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Emits data to the server on assignee channels.
   */
  public emitAssignees(assignees: object[]): void {
    try {
      this.socket.emit('assignees', JSON.stringify(assignees));
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Emits data to the server on customer channels.
   */
  public emitCustomers(customer: object[]): void {
    try {
      this.socket.emit('customers', JSON.stringify(customer));
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Emits data to the server on settings channels.
   */
  public emitSettings(settings: object[]): void {
    try {
      this.socket.emit('settings', JSON.stringify(settings));
    } catch (error) {
      console.error(error);
    }
  }
}

// Exports.
export default new WebsocketHandler();
