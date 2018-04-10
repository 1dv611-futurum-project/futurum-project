/**
 * Handles the connection against the database.
 */

//Imports
import * as mongoose from 'mongoose';
import * as events from 'events';
import Customer from './../models/Customer';
import ICustomer from './../models/interfaces/ICustomer';

/**
 * Sets up and handles the database.
 */
class MongoDBHandler extends events.EventEmitter {

  private db;

  constructor() {
    super();
    this.setUpDBListeners();
  }

  public connect(): void {
    this.connectToDB();
  }

  public getCustomer(customerInfo: object): ICustomer {
    return new Promise((resolve, reject) => {
      Customer.find(customerInfo)
      .then((customer: ICustomer) => {
        if (customer === null) {
          reject('no customer with that email');
        }

          resolve(customer);
      });
    });
  }
  
  public addCustomer(customerInfo: ICustomer): ICustomer {
    let newCustomer = new Customer(customerInfo);
    newCustomer.save()
    .then((customer) => {
      console.log(customer);
      return customer;
    })
    .catch((error) => {
      console.log('error');
      console.log(error)
    })
  } 

  private setUpDBListeners(): void {
    this.db = mongoose.connection;
    mongoose.Promise = global.Promise

    this.db.on('error', () => {
      this.emit('error');
    })
  
    this.db.once('open', () => {
      this.emit('ready');
    })
  
    // Close database connection if node process closes.
    process.on('SIGINT', () => {
      this.db.close(() => {
        process.exit(0);
      })
    })
  }

  /**
   * Connects to the database.
   */
  private connectToDB(): void {
    mongoose.connect('mongodb://futurum-db:27017')
    .catch((error) => {
      this.emit('error', error);
    });
  }
}

// Exports.
export default new MongoDBHandler();
