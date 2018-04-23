/**
 * Handles the connection against the database.
 */

// Imports
import * as events from 'events';

import Customer from './../../models/Customer';
import Assignee from './../../models/Assignee';
import Ticket from './../../models/Ticket';

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
  public connect(connectionString: string): void {
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
      this.getAllFromType(type, replaceOn)
      .then((allFound) => {
        if (allFound.length > 0) {
          const updated = allFound.map((found) => {
            /**
             * Todo: Implement set?
             */
            found.set(info);
            return found.save();
          });

          return Promise.all(updated);
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
   * Removes all documents of the given type that matches the given attributes.
   */
  public removeAll(type: string, removeOn: object): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getAllFromType(type, removeOn)
      .then((result) => {
        result.forEach((found) => found.remove());
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

  public createNewFromType(type: string, info: object): Promise<object> {
    return new Promise((resolve, reject) => {
      /**
       * Check that object doesn't already exist in DB.
       * if ( Customer.findOne(info) ) {
       *  reject();
       * }
       */
      type = type.toLowerCase();
      let toSave;

      switch (type) {
      case 'customer':
        // toSave = new Customer(info);
        info.save()
          .then((saved) => {
            resolve(saved);
          })
          .catch((error) => {
            reject(error);
          });
        break;
      case 'ticket':
        // toSave = new Ticket(info);
        info.save()
          .then((saved) => {
            resolve(saved);
          })
          .catch((error) => {
            reject(error);
          });
        break;
      case 'assignee':
        // toSave = new Assignee(info);
        info.save()
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
}

// Exports.
export default DBHandler;

/*
 * Example email to map to db objects
{ type: 'ticket',
  id: 0,
  status: 0,
  assignee: null,
  mailID: 'CAHm9NZDiA=EYN9N7_r66TFr49ws0JYoEEjXbMU9Y2i4W9w8fug@mail.gmail.com',
  created: 2018-04-21T13:48:01.000Z,
  title: 'master',
  from: { name: 'Johan Söderlund', email: 'js223zs@student.lnu.se' },
  messages: 
    [ { received: 2018-04-21T13:48:01.000Z,
        body: 'are you?\n',
        fromCustomer: true } ] }
*/
