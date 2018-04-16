/**
 * MessageInput component
 * @module components/MessageInput/MessageInput
 */

import * as React from 'react';
import { Button, Paper } from 'material-ui';
import TextArea from 'react-textarea-autosize';

/**
 * MessageInput Props Interface
 */
export interface IMessageInput {
	onClick(message: string): any;
	open: boolean;
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
					<Button variant='raised' size='small' className='message-input__footer__btn' onClick={this.handleClick}>
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
		this.props.onClick(this.state.message);
	}
}
