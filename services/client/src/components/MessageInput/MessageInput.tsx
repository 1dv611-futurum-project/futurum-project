/**
 * MessageInput component
 * @module components/MessageInput/MessageInput
 */
import * as React from 'react';
import { Paper } from 'material-ui';
import TextArea from 'react-textarea-autosize';
import * as moment from 'moment';
import 'moment/locale/sv';

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
			message: '',
			validationFailed: false
		};
	}

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const { open } = this.props;
		const { validationFailed } = this.state;
		const cssClasses = open ? 'message message-input' : 'message message-input message-input--hidden';
		const footerClasses = validationFailed ?
			'message-input__footer message-input__footer--error' : 'message-input__footer';

		return (
			<Paper className={cssClasses}>
				<label htmlFor='message' className='message-input__label'>
					Svara på ärendet
				</label>
				<TextArea
					className='message-input__textarea'
					name='message'
					value={this.state.message}
					onChange={(e) => this.setState({ message: e.target.value})}
				/>
				{validationFailed && (<p className='message-input__error'>Det här fältet får inte lämnas tomt.</p>)}
				<div className={footerClasses}>
					<Button theme={true} block={true} onClick={this.handleClick}>
						Skicka
					</Button>
				</div>
			</Paper>
		);
	}

	/**
	 * Handles button click to send the new message
	 * @private
	 */
	private handleClick = () => {
		if (this.state.message.length < 1) {
			this.setState({ validationFailed: true });
			return;
		}

		this.props.ticket.body.push({
			received: moment().format(),
			body: this.state.message,
			fromName: this.props.ticket.assignee ? this.props.ticket.assignee.name : 'Futurum Digital'
		});

		this.setState({ message: '', validationFailed: false });
		this.props.onClick(this.props.ticket);
	}
}
