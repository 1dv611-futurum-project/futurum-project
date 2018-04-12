/**
 * Handles the connection against the database.
 */

//Imports
import * as events from 'events';

import Customer from './../../models/Customer';
import ICustomer from './../../models/interfaces/ICustomer';

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
   * Gets a customer from the database
   * with info matching the customer object.
   */
  public getCustomers(customerInfo: object): Promise<ICustomer[]> {
    return new Promise((resolve, reject) => {
      Customer.find(customerInfo)
      .then((customer) => {
        resolve(customer);
      })
      .catch((err) => {
        reject(err);
      })
    });
  }

  /**
   * Adds a customer with the given info to the database.
   */
  public addCustomer(customerInfo: ICustomer): Promise<ICustomer> {
    return new Promise((resolve, reject) => {
      this.getCustomers(customerInfo)
      .then((customer) => {
        if (customer.length > 0) {
          resolve(customer[0])
        } else {
          let newCustomer = new Customer(customerInfo);
          return newCustomer.save();
        }
      })
      .then((customer) => {
        resolve(customer);
      })
      .catch((error) => {
        reject(error);
      })
    });
  } 

  /**
   * Removes customers with the given info from the database.
   */
  public removeCustomer(customerInfo: ICustomer): Promise<ICustomer> {
    return new Promise((resolve, reject) => {
      Customer.find(customerInfo)
      .then((customers) => {
        console.log(customers)
        customers.forEach(customer => customer.remove());
        resolve();
      })
    });
  } 

  /**
   * Sets up listeners on the database connection.
   */
  private setUpDBListeners(): void {
    this.dbconnection.on('connection-error', (err) => {
      this.emit('error', err);
    })

    this.dbconnection.on('ready', () => {
      this.emit('ready');
    })

    this.dbconnection.on('disconnected', () => {
      this.emit('disconnected');
    })

    this.dbconnection.on('close', () => {
      this.emit('disconnected');
    })
  }
}

// Exports.
export default DBHandler;
