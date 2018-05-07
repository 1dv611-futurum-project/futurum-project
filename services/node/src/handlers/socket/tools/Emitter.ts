/**
 * Handles the websocket connection against the client.
 */

// Imports.
import * as SocketIo from 'socket.io';
// import { }

/**
 * Handles the connection.
 */
export default class Emitter {
  private io: any;
  private db: any;

  constructor(io: any, db: any) {
    this.io = io;
    this.db = db;
  }

  public emitAll() {
    this.emitTickets();
    this.emitAssignees();
    this.emitCustomers();
    this.emitSettings();
    this.emitExpired();
  }

  /**
   * Emits data to the server on ticket channels.
   */
  public emitTickets(): void {
    this.db.getAll('ticket', {})
        .then((tickets: any) => {
          this.io.emit('tickets', JSON.stringify(tickets));
        })
        .catch((error) => {
          console.log('Could not get tickets from DB');
          console.log(error);
        });
  }

  /**
   * Emits data to the server on assignee channels.
   */
  public emitAssignees(): void {
    this.db.getAll('assignee', {})
        .then((assignees: any) => {
          this.io.emit('assignees', JSON.stringify(assignees));
        })
        .catch((error) => {
          console.log('Could not get asignees from DB');
          console.log(error);
        });
  }

  /**
   * Emits data to the server on customer channels.
   */
  public emitCustomers(): void {
    this.db.getAll('customer', {})
        .then((customers: any) => {
          this.io.emit('customers', JSON.stringify(customers));
        })
        .catch((error) => {
          console.log('Could not get customers from DB');
          console.log(error);
        });
  }

  /**
   * Emits data to the server on message channels.
   */
  public emitErrorMessage(message: object): void {
    this.io.emit('messages', JSON.stringify(message));
  }

  /**
   * Emits data to the server on message channels.
   */
  public emitSuccessMessage(message: object): void {
    this.io.emit('messages', JSON.stringify(message));
  }

  /**
   * Emits data to the server on settings channels.
   */
  public emitSettings(): void {
    this.io.emit('settings', JSON.stringify([]));
  }

  /**
   * Emit information about expired jwt.
   */
  public emitExpired(): void {
    const exp = new Date(this.io.decoded_token.exp * 1000).getTime() - new Date().getTime();
    setTimeout(() => {
      this.io.emit('expired');
      this.io.disconnect();
    }, exp);
  }
}
