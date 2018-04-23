/**
 * Handles the websocket connection against the client.
 */

// Imports.
import * as SocketIo from 'socket.io';
import Pusher from './Pusher';
import Receiver from './Receiver';

const mockData = [];
const mockCustomers = [];
const mockSettings = [];

/**
 * Handles the connection.
 */
class WebsocketHandler {

  private static readonly PORT: number = 3001;
  private static readonly PATH: string = '/socket';

  private io: SocketIo.Server;
  private port: string | number;

  private pusher: Pusher;
  private receiver: Receiver;

  public get SocketPusher(): Pusher {
    return this.pusher;
  }

  public get SocketReceiver(): Receiver {
    return this.receiver;
  }

  constructor() {
    this.pusher = new Pusher(this.io);
    this.receiver = new Receiver(this.io);

    this.config();
    this.listen();
    this.onConnect();
  }

  private config(): void {
    this.io = SocketIo({ path: WebsocketHandler.PATH });
  }

  public listen(): void {
    this.io.listen(WebsocketHandler.PORT);
  }

  public onConnect(): void {
    this.io.on('connection', (socket: any) => {
      this.pusher.emitAllTickets(mockData);
      this.pusher.emitAllCustomers(mockCustomers);
      this.pusher.emitSettings(mockSettings);
    });
  }
}

// Exports.
export default new WebsocketHandler();
