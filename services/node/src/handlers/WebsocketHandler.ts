/**
 * Handles the websocket connection against the client.
 */

// Imports.
import * as SocketIo from 'socket.io';
import * as SocketIoJwt from 'socketio-jwt-decoder';

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
] as object[];

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

const assigneesMock = ['Anton Myrberg', 'Sebastian Borgstedt', 'Dev Devsson'];

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
    this.authorize();
    this.listen();
    // this.onConnect();
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
      this.emitTickets(mockData);
      this.emitAssignees(assigneesMock);
      this.emitCustomers(customerMock);
      this.emitSettings(settingsMock);

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
      // this.emitTickets(mockData);
      this.emitAssignees(assigneesMock);
      this.emitCustomers(customerMock);
      this.emitSettings(settingsMock);
      callback(socket);
    });
  }

  /**
   * Emits data to the server on ticket channels.
   */
  public emitTicket(ticket: object): void {
    try {
      mockData.push(ticket);
      this.socket.emit('tickets', JSON.stringify(mockData));
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Emits data to the server on ticket channels.
   */
  public emitTickets(tickets: object[]): void {
    try {
      this.socket.emit('tickets', JSON.stringify(tickets));
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Emits data to the server on assignee channels.
   */
  public emitAssignees(assignees: string[]): void {
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
