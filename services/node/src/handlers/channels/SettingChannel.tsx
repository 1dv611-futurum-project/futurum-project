/**
 * Handles the websocket connection against the client.
 */

import * as SocketIO from 'socket.io-client';

import { Channel } from './Channel';
import { SettingEvent } from '../events/SettingEvent';

/**
 * Handles the connection.
 */
export default class SettingChannel extends Channel  {

  public channel = SettingEvent.CHANNEL;

  public onSettings(cb: any) {
    this.listen(cb);
  }

  public emitSettings(settings: object[]) {
    this.emit(SettingEvent.UPDATE, settings);
  }
}
