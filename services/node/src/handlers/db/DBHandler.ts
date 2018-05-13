/**
 * Handles the connection against the database.
 */

// Imports
import * as events from 'events';

import CustomerInteractor from './tools/CustomerInteractor';
import AssigneeInteractor from './tools/AssigneeInteractor';
import TicketInteractor from './tools/TicketInteractor';
import AnswerInteractor from './tools/AnswerInteractor';

/**
 * Sets up and handles the database.
 */
class DBHandler extends events.EventEmitter {

  private dbconnection;
  private interactors;

  constructor(dbconnection) {
    super();
    this.dbconnection = dbconnection;
    this.setUpInteractors();
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
    const lowerCaseType = type.toLowerCase();
    return this.interactors[lowerCaseType].getOne(info);
  }

  /**
   * Returns all documents of the specific type that matches the info given.
   */
  public getAll(type: string, info: object): Promise<object[]> {
    const lowerCaseType = type.toLowerCase();
    info = info || {};
    return this.interactors[lowerCaseType].getAll(info);
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
    const lowerCaseType = type.toLowerCase();
    const conditions = findBy || info;
    return this.interactors[lowerCaseType].addOrUpdate(info, conditions);
  }

  /**
   * Removes one document of the given type that matches the given attributes.
   */
  public removeOne(type: string, removeOn: object): Promise<object> {
    const lowerCaseType = type.toLowerCase();
    return this.interactors[lowerCaseType].removeOne(removeOn);
  }

  /**
   * Removes all document of the given type that matches the given attributes.
   */
  public removeAll(type: string, removeOn: object): Promise<object> {
    const lowerCaseType = type.toLowerCase();
    return this.interactors[lowerCaseType].removeAll(removeOn);
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

  /**
   * Sets up the database interactors.
   */
  private setUpInteractors() {
    this.interactors = {};
    this.interactors.customer = new CustomerInteractor();
    this.interactors.assignee = new AssigneeInteractor();
    this.interactors.ticket = new TicketInteractor();
    this.interactors.answer = new AnswerInteractor();
  }
}

// Exports.
export default DBHandler;
