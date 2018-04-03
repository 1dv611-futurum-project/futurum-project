/**
 * Interface for the ImapConnection.
 */

// Imports.
import * as events from 'events';

/**
 * Emits events ['ready', 'error', 'mail', 'server', 'change']
 */
interface IMAPConnectionInterface extends events.EventEmitter {
  connect(): void;
  getUnreadEmails(): Promise;
  listenForNewEmails(): Promise;
  closeConnection(): void;
}

// Exports.
export default IMAPConnectionInterface;
