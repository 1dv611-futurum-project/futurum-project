/**
 * IMAPConnection event types
 */

// Exports
export enum IMAPConnectionEvent {
	ERROR = 'error',
	SERVER = 'server',
	CHANGE = 'change',
	MAIL = 'mail',
	READY = 'ready',
	UNAUTH = 'unauth'
}
