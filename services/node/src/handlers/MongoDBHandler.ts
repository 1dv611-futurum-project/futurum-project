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
  private connectionString;

  constructor() {
    super();
    this.setUpDBListeners();
  }

  /**
   * Connects to the database with the connectionstring given.
   */
  public connect(connectionString: string): void {
    this.connectionString = connectionString;
    this.connectToDB();
  }

  /**
   * Disconnects from the database if there is an active connection.
   */
  public disconnect(): void {
    if (this.db) {
      this.db.close(() => {
        this.emit('close');
      });
    } else {
      this.emit('close');
    } 
  }

  /**
   * Gets a customer from the database
   * with info matching the customer object.
   */
  public getCustomer(customerInfo: object): Promise<ICustomer> {
    return new Promise((resolve, reject) => {
      Customer.find(customerInfo)
      .then((customer: ICustomer) => {
        if (customer === null) {
          reject({message: 'no customer with that information'});
        }

          resolve(customer);
      });
    });
  }

  /**
   * Adds a customer with the given info to the database.
   */
  public addCustomer(customerInfo: ICustomer): Promise<ICustomer> {
    return new Promise((resolve, reject) => {
      let newCustomer = new Customer(customerInfo);
      newCustomer.save()
      .then((customer) => {
        resolve(customer);
      })
      .catch((error) => {
        reject(error);
      })
    });
  } 

  /**
   * Sets up listeners on the database.
   */
  private setUpDBListeners(): void {
    this.db = mongoose.connection;
    mongoose.Promise = global.Promise

    this.db.on('error', () => {
      this.emit('error');
    })
  
    this.db.once('open', () => {
      this.emit('ready');
    })

    this.db.on('connected', () => {
      this.emit('ready');
    })

    this.db.on('disconnected', () => {
      this.emit('disconnect');
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
    mongoose.connect(this.connectionString)
    .catch((error) => {
      this.emit('error', error);
    });
  }
}

// Exports.
export default new MongoDBHandler();
