
/**
 * Message model for error and success communication
 */
export default class Message {

  private type: string;
  private content: string;
	private object: object;

  constructor(type: string, content: string, object?: object) {
		this.type = type;
		this.content = content;
		this.object = object;
  }

}
