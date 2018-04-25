/**
 * Incoming mail event types
 */
export enum IncomingMailEvent {
  ERROR = 'error',
  FORWARD = 'forward',
  ANSWER = 'answer',
  TICKET = 'mail',
  MESSAGE = 'message',
  TAMPER = 'tamper',
  UNAUTH = 'unauth'
}
