/**
 * Interface for the ImapConnection.
 */

// Imports.
import * as events from 'events';

/**
 * Emits events ['ready', 'error', 'mail', 'server', 'change']
 */
interface IMAPConnectionInterface extends events.EventEmitter {
  updateCredentials(): void;
  getUnreadEmails(): Promise<void>;
  listenForNewEmails(): Promise<void>;
  closeConnection(): void;
}

// Exports.
export default IMAPConnectionInterface;
