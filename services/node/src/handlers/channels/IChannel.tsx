/**
 * Handles the connection.
 */
export interface IChannel {
  channel: string;
  listen(event: string, cb: any): void;
  emit(event: string, data: any): void;
}
