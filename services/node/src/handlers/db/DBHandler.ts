/**
 * Handles the connection against the database.
 */

// Imports
import * as events from 'events';

import Customer from './models/Customer';
import Assignee from './models/Assignee';
import Ticket from './models/Ticket';
import ITicket from './interfaces/ITicket';
import IAssignee from './interfaces/IAssignee';
import ICustomer from './interfaces/ICustomer';
import IMail from './interfaces/IMail';
import { AssigneeMismatchError } from './../../config/errors';
import { CustomerMismatchError } from './../../config/errors';
import { DBCreationError } from './../../config/errors';
import IReceivedEmail from '../email/interfaces/IReceivedEmail';
import IReceivedAnswer from '../email/interfaces/IReceivedAnswer';
import IReceivedTicket from '../email/interfaces/IReceivedTicket';

/**
 * Sets up and handles the database.
 */
class DBHandler extends events.EventEmitter {

  private dbconnection;

  constructor(dbconnection) {
    super();
    this.dbconnection = dbconnection;
    this.setUpDBListeners();
    // TODO: Change this to handling the same way customers are handled?
    this.seedAssignees();
    // this.seedCustomers();
  }

  // For development
  private seedAssignees() {
    this.addOrUpdate('Assignee', {name: 'Anton Myrberg', email: 'anton@anton.com'}, {email: 'anton@anton.com'});
    this.addOrUpdate('Assignee', {name: 'Sebastian Borgfeldt', email: 'sebbe@sebbe.com'}, {email: 'sebbe@sebbe.com'});
  }

  // For development
  private seedCustomers() {
    this.addOrUpdate('Customer',
    {name: 'Johan Söderlund', email: 'js223zs@student.lnu.se'}, {email: 'js223zs@student.lnu.se'});
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
   * @param findBy - The property to look for in case of updating
   * a document rather than adding one. If a document with the property is found
   * that one will be updated with the new information, and no new document will be created.
   * If more than one matching result is found, all will be updated.
   */
  public addOrUpdate(type: string, info: object, findBy?: object): Promise<object[]> {
    return new Promise((resolve, reject) => {
      this.addOrUpdateFromType(type, info, findBy)
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
        if (result !== null) {
          result.remove();
          resolve(result);
        }
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
        .populate('from')
        .populate('assignee')
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
          .then((customers) => {
            return Promise.all(customers.map((customer) => {
              return Ticket.find({from: customer._id})
              .then((tickets) => {
                customer.errands = tickets.length;
                return customer;
              });
            }));
          })
          .then((customers) => {
            resolve(customers);
          })
          .catch((error) => {
            reject(error);
          });
        break;
      case 'ticket':
        Ticket.find(info)
          .populate('from')
          .populate('assignee')
          .then((tickets) => {
            resolve(tickets);
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

  private addOrUpdateFromType(type: string, info: object, findBy: object): Promise<object> {
    const conditions = findBy || info;
    const options = {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    };

    return new Promise((resolve, reject) => {
      type = type.toLowerCase();
      switch (type) {
      case 'ticket':
        this.createNewTicket(conditions, info as IReceivedTicket, options)
          .then((saved) => {
            return this.getOne('ticket', saved);
          })
          .then((populated) => {
            resolve(populated);
          })
          .catch((error) => {
            reject(error);
          });
        break;
      case 'answer':
        this.createNewAnswer(conditions, info as IReceivedAnswer, options)
          .then((saved) => {
            return this.getOne('ticket', saved);
          })
          .then((populated) => {
            resolve(populated);
          })
          .catch((error) => {
            reject(error);
          });
        break;
      case 'customer':
        this.createNewCustomer(conditions, info as ICustomer, options)
          .then((saved) => {
            resolve(saved);
          })
          .catch((error) => {
            reject(error);
          });
        break;
      case 'assignee':
        this.createNewAssignee(conditions, info as IAssignee, options)
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

  /**
   * Creates a new ticket or updates an old one.
   */
  private createNewTicket(conditions: object, info: IReceivedTicket, options: object): Promise<ITicket> {
    return new Promise((resolve, reject) => {
      const ticket = {} as ITicket;

      if (info.mailId) {
        ticket.mailId = info.mailId;
      }

      if (info.created) {
        ticket.created = new Date(info.created);
      }

      if (info.title) {
        ticket.title = info.title;
      }

      if (info.status) {
        ticket.status = info.status;
      }

      if (info.replyId) {
        ticket.replyId = info.replyId;
      }

      this.getCustomerReference(info)
      .then((ref) => {
        ticket.from = ref;
        return this.getAssigneeReference(info);
      })
      .then((ref) => {
        ticket.assignee = ref;
        return Ticket.findOne(conditions);
      })
      .then((found) => {
        if (found) {
          const fieldsToUpdate = Object.keys(ticket);
          fieldsToUpdate.forEach((attribute) => {
            found[attribute] = ticket[attribute];
          });

          const bodies = Array.isArray(info.body)
            ? info.body as IMail[]
            : found.body.concat(this.createNewMails(info.body)) as IMail[];
          found.body = bodies;
        } else {
          ticket.body = this.createNewMails(info.body);
          found = new Ticket(ticket);
        }
        return found.save();
      })
      .then((saved) => {
        resolve(saved);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Adds to the answer-thread.
   */
  private createNewAnswer(conditions: object, info: IReceivedAnswer, options: object) {
    return new Promise((resolve, reject) => {
      Ticket.findOne(conditions)
      .then((found) => {
        if (found) {
          const bodies = found.body.concat(this.createNewMails(info));
          found.body = bodies;

          const replyIDs = found.replyId;
          replyIDs.push('<' + info.mailID + '>');
          found.replyId = replyIDs;
          return found.save();
        } else {
          // TODO: some sort of error
          console.log('error');
          reject();
        }
      })
      .then((saved) => {
        resolve(saved);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Creates an array of mail-bodies.
   */
  private createNewMails(emails: any): IMail[] {
    const mailBodies = [];
    emails = Array.isArray(emails) ? emails : [emails];
    emails.forEach((email) => {
      mailBodies.push({
        received: email.received,
        fromCustomer: email.fromCustomer,
        body: email.body});
    });
    return mailBodies;
  }

  /**
   * Creates a new customer.
   */
  private createNewCustomer(conditions: object, customer: ICustomer, options: object): Promise<ICustomer> {
    return new Promise((resolve, reject) => {
      Customer.findOneAndUpdate(conditions, customer, options, (err, saved: Customer) => {
        if (err) {
          reject(new DBCreationError('Customer could not be saved in the Database.'));
        }

        resolve(saved);
      });
    });
  }

  /**
   * Creates a new assignee.
   */
  private createNewAssignee(conditions: object, assignee: IAssignee, options: object): Promise<IAssignee> {
    return new Promise((resolve, reject) => {
      Assignee.findOneAndUpdate(conditions, assignee, options, (err, saved: IAssignee) => {
        if (err) {
          reject(new DBCreationError('Assignee could not be saved in the Database.'));
        }

        resolve(saved);
      });
    });
  }

  private getCustomerReference(info: IReceivedTicket): Promise<string> {
    return new Promise((resolve, reject) => {
      if (info.from) {
        this.getOne('Customer', {email: info.from.email})
        .then((customer) => {
          resolve(customer._id);
        })
        .catch(() => {
          reject(new CustomerMismatchError('No such customer in the database'));
        });
      } else {
        resolve(null);
      }
    });
  }

  private getAssigneeReference(info: IReceivedTicket): Promise<string> {
    return new Promise((resolve, reject) => {
      if (info.assignee) {
        this.getOne('Assignee', {email: info.assignee.email})
        .then((assignee) => {
          resolve(assignee._id);
        })
        .catch(() => {
          reject(new AssigneeMismatchError('No such assignee in the database'));
        });
      } else {
        resolve(null);
      }
    });
  }
}

// Exports.
export default DBHandler;
