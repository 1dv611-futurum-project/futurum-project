/**
 * MessageInput component
 * @module components/MessageInput/MessageInput
 */

import * as React from 'react';
import { Paper } from 'material-ui';
import TextArea from 'react-textarea-autosize';

import Button from '../../elements/CustomButton/CustomButton';

/**
 * MessageInput Props Interface
 */
export interface IMessageInput {
	open: boolean;
	ticket: any;
	onClick(ticket: any): void;
}

/**
 * MessageInput class
 */
export class MessageInput extends React.Component<IMessageInput, any> {

	constructor(props: any) {
		super(props);

		this.state = {
			message: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const { open } = this.props;
		const cssClasses = open ? 'message message-input' : 'message message-input message-input--hidden';

		return (
			<Paper className={cssClasses}>
				<label htmlFor='message' className='message-input__label'>Svara på ärendet</label>
				<TextArea
					className='message-input__textarea'
					name='message'
					value={this.state.message}
					onChange={this.handleChange}
				/>
				<div className='message-input__footer'>
					<Button theme={true} block={true} onClick={this.handleClick}>
						Skicka
					</Button>
				</div>
			</Paper>
		);
	}

	/**
	 * Handles change in textarea
	 * @private
	 */
	private handleChange(e: any) {
		this.setState({ message: e.target.value});
	}

	/**
	 * Handles button click to send the new message
	 * @private
	 */
	private handleClick() {
		this.props.ticket.messages.push({
			received: new Date().toString(),
			body: this.state.message,
			fromCustomer: false
		});

		this.setState({ message: '' });
		this.props.onClick(this.props.ticket);
	}
}
