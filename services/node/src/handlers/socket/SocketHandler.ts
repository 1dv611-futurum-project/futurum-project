/**
 * Handles the websocket connection against the client.
 */

// Imports.
import * as SocketIo from 'socket.io';
import * as SocketIoJwt from 'socketio-jwt-decoder';

import Listener from './tools/Listener';
import Emitter from './tools/Emitter';
import MailSender from './tools/MailSender';
import Message from './models/Message';

/**
 * Handles the connection.
 */
export default class SocketHandler {
  private static readonly PORT: number = 3001;
  private static readonly PATH: string = '/socket';
  private io: SocketIo.Server;
  private db: any;
  private emailhandler: any;
  private mailSender: any;
  private listener: Listener;

  public emitter: Emitter;

  constructor(db: any, emailhandler: any) {
    this.db = db;
    this.emailhandler = emailhandler;
    this.mailSender = new MailSender(this.emailhandler);

    this.config();
    this.authorize();
    this.listen();
    this.onConnect();
  }

  private config(): void {
    this.io = SocketIo({ path: SocketHandler.PATH });
  }

  private authorize(): void {
    this.io.use(SocketIoJwt.authorize({
      secret: 'secret',
      handshake: true
    }));
  }

  private listen(): void {
    this.io.listen(SocketHandler.PORT);
  }

  private onConnect(): void {
    this.io.on('connection', (socket: any) => {
      this.emitter = new Emitter(socket, this.db);
      this.listener = new Listener(socket, this.db, this.mailSender, this.emitter);
      this.emitter.emitAll();
      this.listener.startListeners();
    });
  }
}
