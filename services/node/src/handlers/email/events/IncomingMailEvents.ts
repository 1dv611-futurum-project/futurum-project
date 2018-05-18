/**
 * Incoming mail event types
 */

// Exports
export enum IncomingMailEvent {
	ERROR = 'error',
	FORWARD = 'forward',
	ANSWER = 'answer',
	TICKET = 'ticket',
	MESSAGE = 'message',
	TAMPER = 'tamper',
	UNAUTH = 'unauth'
}
