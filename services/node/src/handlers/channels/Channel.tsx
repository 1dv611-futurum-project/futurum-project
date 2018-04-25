/**
 * Handles the websocket connection against the client.
 */

import * as SocketIo from 'socket.io';
import { IChannel } from './IChannel';

/**
 * Handles the connection.
 */
export class Channel implements IChannel {

  private socket: SocketIo.Server;
  public channel: string;

  constructor(socket: SocketIo.Socket) {
    this.socket = socket;
  }

  public listen(cb: any) {
    this.socket.on(this.channel, cb);
  }

  public emit(event: string, data: any) {
    this.socket.emit(this.channel, event, data);
  }
}
