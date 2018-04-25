/**
 * Handles the websocket connection against the client.
 */
import { Channel } from './Channel';
import { CustomerEvent } from '../events/CustomerEvent';

/**
 * Handles customer events
 */
export default class CustomerChannel extends Channel {

  public channel = CustomerEvent.CHANNEL;

  public onAddCustomer(cb: any) {
    this.listen(cb);
  }

  public onEditCustomer(cb: any) {
    this.listen(cb);
  }

  public onDeleteCustomer(cb: any) {
    this.listen(cb);
  }

  public emitCustomers(customers: object[]) {
    this.emit(CustomerEvent.CUSTOMERS, customers);
  }

}
