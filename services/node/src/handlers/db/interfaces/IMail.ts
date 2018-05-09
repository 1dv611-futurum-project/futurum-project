/**
 * Interface for the messages
 */

export default interface IMail {
  received?: Date;
  body?: string;
  fromName?: string;
}
