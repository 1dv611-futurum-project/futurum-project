/**
 * Handles the connection against the database.
 */

// Imports
import * as events from 'events';

import Customer from './../../models/Customer';
import Assignee from './../../models/Assignee';
import Ticket from './../../models/Ticket';
import Mail from './../../models/Mail';


const ticketMock = [
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
  email: ['customer@email.com', 'customer@email2.com'],
  name: 'Problematic Dude'
},
  {
    email: ['ACE@email.com'],
    name: 'esset'
  },
  {
    email: ['potatoaemail@email.com', 'potatoaemail@email2.com'],
    name: 'Nilz'
  } ] as object[];

const assigneesMock = [ {
  email: ['dev@futurumdigital.se'],
  name: 'Anton Myrberg'
},
  {
    email: ['dev@futurumdigital.se'],
    name: 'Sebastian Borgstedt'
  },
  {
    email: ['dev@futurumdigital.se'],
    name: 'Dev Devsson'
  } ] as object[];

const settingsMock = [];

const ticketArr = [];

/**
 * Sets up and handles the database.
 */
class DBHandler extends events.EventEmitter {

  private dbconnection;

  constructor(dbconnection) {
    super();
    this.dbconnection = dbconnection;
    this.setUpDBListeners();
  }

  /**
   * Connects to the database with the connectionstring given.
   */
  public connect(connectionString: string) {
    this.dbconnection.connect(connectionString);
  }

  /**
   * Returns the first document of the specific type that matches the info given.
   */
  public getOne(type: string, info: object): Promise<object> {
    return new Promise((resolve, reject) => {
      this.getOneFromType(type, info)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Returns all documents of the specific type that matches the info given.
   */
  public getAll(type: string, info: object): Promise<object[]> {
    return new Promise((resolve, reject) => {
      this.getAllFromType(type, info)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Adds the given object of the given type to the databse.
   * @param info - The info of the object to add.
   * @param replaceOn - The property to look for in case of updating
   * a document rather than adding one. If a document with the property is found
   * that one will be updated with the new information, and no new document will be created.
   * If more than one matching result is found, all will be updated.
   */
  public addOrUpdate(type: string, info: object, replaceOn?: object): Promise<object[]> {
    return new Promise((resolve, reject) => {
      const created = replaceOn ? this.getOneFromType(type, replaceOn) : this.createNewFromType(type, info);

      created
      .then((found) => {
        if (found && replaceOn) {
          found.set(info);
          return found.save();
        } else if (found) {
          return found.save();
        } else {
          return this.createNewFromType(type, info);
        }
      })
      .then((saved) => {
        if (!Array.isArray(saved)) {
          resolve([saved]);
        } else {
          resolve(saved);
        }
      })
      .catch((error) => {
        reject(error);
      });
    });
  }

  /**
   * Removes one document that matches the given attributes.
   * @todo {resolve(result)} Solve the BUG occuring because of PENDING state of Promise.resolve()
   * is it possible that callback with pending removal can throw exception after actions in App/socket/emailhandler?
   * @todo (node:131) UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'remove' of null
   */
  public removeOne(type: string, removeOn: object): Promise<object> {
    return new Promise((resolve, reject) => {
      this.getOneFromType(type, removeOn)
      .then((result) => {
        // result.remove().exec();
        // return Promise.call(result.remove().exec());
        if (result !== null) {
          console.log(result);
          result.remove();
          resolve(result);
        }
        // reject(result);
        // resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Removes all documents of the given type that matches the given attributes.
   */
  public removeAll(type: string, removeOn: object): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getAllFromType(type, removeOn)
      .then((result) => {
        const tmp = JSON.stringify(result);
        result.forEach((found) => found.remove().exec());
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Sets up listeners on the database connection.
   */
  private setUpDBListeners(): void {
    this.dbconnection.on('connection-error', (err) => {
      this.emit('error', err);
    });

    this.dbconnection.on('ready', () => {
      this.emit('ready');
    });

    this.dbconnection.on('disconnected', () => {
      this.emit('disconnected');
    });
    this.dbconnection.on('close', () => {
      this.emit('disconnected');
    });
  }

  private getOneFromType(type: string, info: object): Promise<object> {
    return new Promise((resolve, reject) => {
      type = type.toLowerCase();
      switch (type) {
      case 'customer':
        Customer.findOne(info)
          .then((customer) => {
            resolve(customer);
          })
          .catch((error) => {
            reject(error);
          });
        break;
      case 'ticket':
        Ticket.findOne(info)
          .then((ticket) => {
            resolve(ticket);
          })
          .catch((error) => {
            reject(error);
          });
        break;
      case 'assignee':
        Assignee.findOne(info)
          .then((assignee) => {
            resolve(assignee);
          })
          .catch((error) => {
            reject(error);
          });
        break;
      default:
        resolve();
        break;
      }
    });
  }

  private getAllFromType(type: string, info: object): Promise<object[]> {
    return new Promise((resolve, reject) => {
      type = type.toLowerCase();
      if (!info) {
        resolve([]);
      }

      switch (type) {
      case 'customer':
        Customer.find(info)
          .then((customer) => {
            resolve(customer);
          })
          .catch((error) => {
            reject(error);
          });
        break;
      case 'ticket':
        Ticket.find(info)
          .then((ticket) => {
            resolve(ticket);
          })
          .catch((error) => {
            reject(error);
          });
        break;
      case 'assignee':
        Assignee.find(info)
          .then((assignee) => {
            resolve(assignee);
          })
          .catch((error) => {
            reject(error);
          });
        break;
      default:
        resolve();
        break;
      }
    });
  }

  private createNewFromType(type: string, info: object): Promise<object> {
    return new Promise((resolve, reject) => {
      /**
       * Check that object doesn't already exist in DB.
       * if ( Customer.findOne(info) ) {
       *  reject();
       * }
       */
      type = type.toLowerCase();
      switch (type) {
      case 'customer':
        this.createNewCustomer(info).save()
          .then((saved) => {
            resolve(saved);
          })
          .catch((error) => {
            reject(error);
          });
        break;
      case 'ticket':
        this.createNewTicket(info, this.createNewMails(info))
          .save()
          .then((saved) => {
            resolve(saved);
          })
          .catch((error) => {
            reject(error);
          });
        break;
      case 'assignee':
        this.createNewAssignee(info).save()
          .then((saved) => {
            resolve(saved);
          })
          .catch((error) => {
            reject(error);
          });
        break;
      default:
        reject();
        break;
      }
    });
  }

  private createNewMails(mail: any): Mail[] {
    try {
      const mailBodies = [];
      mail.messages.forEach((element) => {
        // todo: ? if not required
        mailBodies.push(new Mail({
          received: element.received,
          fromCustomer: element.fromCustomer,
          body: element.body}));
      });
      return mailBodies;
    } catch (error) {
      console.error(error);
    }
    return;
  }

  private createNewCustomer(customer: object): Customer {
    try {
      let emails = [];
      customer.email.forEach(email => {
        emails.push(email);
      });
      if ('name' in customer) {
        customer = {email: emails, name: customer.name};
      } else {
        customer = {email: emails};
      }
      return new Customer(customer);
    } catch (error) {
      console.error(error);
    }
  }

  private createNewAssignee(assignee: object): Assignee {
    try {
      let emails = [];
      assignee.email.forEach(email => {
        emails.push(email);
      });
      return new Assignee({ email: emails, name: assignee.name });
    } catch (error) {
      console.error(error);
    }
  }

  private createNewTicket(mail: any, mailBodies: Mail[]): Ticket {
    try {
      console.log('should be here creating')
      // todo: ? if not required
      const ticket = {
        from: mail.from.email,
        body: mailBodies,
        mailId: mail.mailID
      };

      console.log(ticket)
      if ('assignee' in mail) {
        ticket.assignee = mail.assignee;
      }
      if ('title' in mail) {
        ticket.title = mail.title;
      }
      if ('status' in mail) {
        ticket.status = mail.status;
      }
      if ('from.name' in mail) {
        ticket.customerName = mail.from.name;
      }

      console.log('returning new ticket')
      console.log(ticket)
      return new Ticket(ticket);
    } catch (error) {
      console.error(error);
    }
    return;
  }

  private DBMockActions(): void {
    ticketArr.push(this.createNewTicket(ticketMock[0], this.createNewMails(ticketMock[0])));
    ticketArr.push(this.createNewTicket(ticketMock[1], this.createNewMails(ticketMock[1])));
    ticketArr.push(this.createNewTicket(ticketMock[2], this.createNewMails(ticketMock[2])));
    this.createNewFromType('ticket', ticketArr[0]);
    this.createNewFromType('ticket', ticketArr[1]);
    this.createNewFromType('ticket', ticketArr[2]);

    this.createNewFromType('customer', customerMock[0]);
    this.createNewFromType('customer', customerMock[1]);
    this.createNewFromType('customer', customerMock[2]);

    this.createNewFromType('assignee', assigneesMock[0]);
    this.createNewFromType('assignee', assigneesMock[1]);
    this.createNewFromType('assignee', assigneesMock[2]);
    // this.DBHandler.removeAll('ticket', {});
  }
}

// Exports.
export default DBHandler;
