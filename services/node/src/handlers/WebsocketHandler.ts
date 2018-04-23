/**
 * Handles the websocket connection against the client.
 */

// Imports.
import * as SocketIo from 'socket.io';

const mockData = [
  {
    type: 'ticket',
    id: 3,
    status: 2,
    assignee: 'Anton Myrberg',
    mailID: 'CACGfpvHcD9tOcJz8YT1CwiEO36VHhH1+-qXkCJhhaDQZd6-JKA@mail.gmail.com',
    created: '2018-04-17T17:56:58.000Z',
    title: 'Ett test igen',
    from: {
      name: 'Dev Devsson',
      email: 'dev@futurumdigital.se'
    },
    messages: [
      {
        received: '2018-04-17T17:56:58.000Z',
        body: 'Vi har mottagit ditt meddelande och återkommer inom kort. Mvh Anton Myrberg',
        fromCustomer: false
      },
      {
        received: '2018-04-17T17:56:58.000Z',
        body: 'adfafdasfa ',
        fromCustomer: true
      }
    ]
  },
  {
    type: 'ticket',
    id: 12,
    status: 1,
    assignee: null,
    mailID: 'CACGfpvHcD9tOcJz8YT1CwiEO36VHhH1+-qXkCJhhaDQZd6-JKA@mail.gmail.com',
    created: '2018-04-17T17:56:58.000Z',
    title: 'Vi har ett problem',
    from: {
      name: 'Dev Devsson',
      email: 'dev@futurumdigital.se'
    },
    messages: [
      {
        received: '2018-04-17T17:56:58.000Z',
        body: 'adfafdasfa ',
        fromCustomer: true
      }
    ]
  },
  {
    type: 'ticket',
    id: 6,
    status: 2,
    assignee: 'Sebastian Borgstedt',
    mailID: 'CACGfpvHcD9tOcJz8YT1CwiEO36VHhH1+-qXkCJhhaDQZd6-JKA@mail.gmail.com',
    created: '2018-04-17T17:56:58.000Z',
    title: 'Nu har det blivit tokigt',
    from: {
      name: 'Dev Devsson',
      email: 'dev@futurumdigital.se'
    },
    messages: [
      {
        received: '2018-04-17T17:56:58.000Z',
        body: 'adfafdasfa ',
        fromCustomer: true
      }
    ]
  }
];

const customerMock = [ {
  _id: 'randomstrang1',
  email: 'customer@email.com',
  name: 'Problematic Dude',
  numberOfErrands: 3
},
  {
    _id: 'randomstrang2',
    email: 'customer@email.com',
    name: 'Problematic Dude',
    numberOfErrands: 5
  } ];

/**
 * Handles the connection.
 */
class WebsocketHandler {

  private static readonly PORT: number = 3001;
  private socket: SocketIo.Server;
  private port: string | number;

  constructor() {
    this.config();
    this.sockets();
    this.listen(3001, () => {const lat = 0; } );
  }

  private config(): void {
    // this.port = process.env.PORT || WebsocketHandler.PORT;
    this.port = WebsocketHandler.PORT;
  }

  private sockets(): void {
    this.socket = SocketIo({ path: '/socket' });
  }

  /**
   * Starts the socket connection
   */
  public listen(port, callback): void {
    this.port = port || this.port;

    this.socket.listen(port);
    this.socket.on('connection', (socket: any) => {
      console.log('Connected client on port %s.', this.port);
      this.emitTickets(mockData);
      this.emitCustomers(customerMock);
      /**
       * disconnect
       */
      this.socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
    callback();
  }

  /**
   * Emits data to the server on ticket channels.
   */
  public emitTicket(ticket: object): void {
    try {
      const tick = JSON.stringify(ticket);
      console.log(tick);
      this.socket.emit('ticket', JSON.stringify(ticket));
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Emits data to the server on ticket channels.
   */
  public emitTickets(tickets: object[]): void {
    try {
      const tick = JSON.stringify(tickets);
      console.log(tick);
      this.socket.emit('tickets', JSON.stringify(tickets));
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

  public onConnection(callback: any): void {
    this.socket.on('connection', callback);
  }

  /**
   * Emits data to all ticket listeners.
   */
  public onTicket(callback: any ): void {
    this.socket.on('ticket', callback );
  }

  /**
   * Emits data to all customer listeners.
   */
  public onCustomer(callback: any ): void {
    this.socket.on('customer', callback);
  }

  /**
   * Emits data to all settings listeners.
   */
  public onSettings(callback: any ): void {
    this.socket.on('settings', callback);
  }

  private originIsAllowed(origin): boolean {
    // put logic here to detect whether the specified origin is allowed.
    return true;
  }
}

// Exports.
export default new WebsocketHandler();
