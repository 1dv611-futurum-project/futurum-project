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

const settingsMock = [];

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
    this.listen();
    this.onConnect();
  }

  private config(): void {
    this.socket = SocketIo({ path: WebsocketHandler.PATH });
  }

  private listen(): void {
    this.socket.listen(WebsocketHandler.PORT);
  }

  private onConnect() {
    this.socket.on('connection', (socket: any) => {
      this.emitTickets(mockData);
      this.emitCustomers(customerMock);
      this.emitSettings(settingsMock);

      socket.on('ticket:status', (data: any) => {
        console.log(data);
      });

      socket.on('ticket:assignee', (data: any) => {
        console.log(data);
      });

      socket.on('ticket:mail', (data: any) => {
        console.log(data);
      });

      socket.on('customer:add', (data: any) => {
        console.log(data);
      });

      socket.on('customer:edit', (data: any) => {
        console.log(data);
      });

      socket.on('customer:delete', (data: any) => {
        console.log(data);
      });

      socket.on('settings:color', (data: any) => {
        console.log(data);
      });

      socket.on('settings:assignee', (data: any) => {
        console.log(data);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
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
}

// Exports.
export default new WebsocketHandler();
