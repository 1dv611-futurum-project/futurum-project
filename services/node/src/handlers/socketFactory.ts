/**
 * Handles the websocket connection against the client.
 */

import * as SocketIo from 'socket.io';
import TicketChannel from './channels/TicketChannel';
import AssigneeChannel from './channels/AssigneeChannel';
import CustomerChannel from './channels/CustomerChannel';
import SettingChannel from './channels/SettingChannel';

/**
 * Handles the connection.
 */
export default class SocketFactory {

  private static URL: string = 'http://127.0.0.1:8080';
  private static PATH: string = '/socket';
  private static readonly PORT: number = 3001;
  private socket: SocketIo.Server;

  constructor() {
    this.config();
  }

  private config() {
    this.socket = SocketIo({ path: SocketFactory.PATH });
    this.socket.listen(SocketFactory.PORT);
  }

  public ticketChannel() {
    return new TicketChannel(this.socket);
  }

  public assigneeChannel() {
    return new AssigneeChannel(this.socket);
  }

  public customerChannel() {
    return new CustomerChannel(this.socket);
  }

  public settingChannel() {
    return new SettingChannel(this.socket);
  }
}
