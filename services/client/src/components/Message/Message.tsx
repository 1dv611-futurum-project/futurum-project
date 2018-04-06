/**
 * Message component
 * @module components/Message/Message
 */

import * as React from 'react';
import { Avatar, Paper } from 'material-ui';
import { Person } from 'material-ui-icons';

/**
 * Message Props Interface
 */
export interface IMessage {
	data: any;
}

/**
 * Message class
 */
export class Message extends React.Component<IMessage, any> {
	public render() {
		const { message, author, date } = this.props.data;

		return (
			<Paper className='message'>
				<Avatar className='message__avatar'>
					<Person className='message__avatar__icon'/>
				</Avatar>
				<div className='message__content'>
					<p className='message__content__title'>
						{author},
						<span className='message__content__title--regular'> {date}</span>
					</p>
					<p className='message__content__text'>{message}</p>
				</div>
			</Paper>
		);
	}
}
