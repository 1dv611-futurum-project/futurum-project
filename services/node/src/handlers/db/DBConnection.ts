/**
 * Handles the connection against the database.
 */

//Imports
import * as mongoose from 'mongoose';
import * as events from 'events';

/**
 * Sets up and handles the database-connection.
 */
class DBConnection extends events.EventEmitter {

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
  public disconnectDB(): void {
    if (this.db) {
      this.db.close(() => {
        this.emit('close');
      });
    } else {
      this.emit('close');
    } 
  }

  /**
   * Sets up listeners on the database.
   */
  private setUpDBListeners(): void {
    this.db = mongoose.connection;
    mongoose.Promise = global.Promise

    this.db.on('error', (err) => {
      this.emit('connection-error', err);
    })

    this.db.on('connected', () => {
      this.emit('ready');
    })

    this.db.on('open', () => {
      this.emit('ready');
    })

    this.db.on('disconnected', () => {
      this.emit('disconnected');
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
    .catch((err) => {
      this.emit('connection-error', err);
    });
  }
}

// Exports.
export default DBConnection;
