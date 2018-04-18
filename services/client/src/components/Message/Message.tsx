/**
 * Message component
 * @module components/Message/Message
 */

import * as React from 'react';
import { Avatar, Paper } from 'material-ui';
import { Person } from 'material-ui-icons';
import * as moment from 'moment';
import 'moment/locale/sv';

/**
 * Message Props Interface
 */
export interface IMessage {
	data: any;
	customer: string;
	assignee: any;
}

/**
 * Message class
 */
export class Message extends React.Component<IMessage, any> {
	public render() {
		const { body, fromCustomer, received } = this.props.data;
		const { customer, assignee } = this.props;

		return (
			<Paper className='message'>
				<Avatar className='message__avatar'>
					<Person className='message__avatar__icon'/>
				</Avatar>
				<div className='message__content'>
					<p className='message__content__title'>
						{fromCustomer ? customer : assignee},
						<span className='message__content__title--regular'> {moment(received).format('L')}</span>
					</p>
					<p className='message__content__text'>{body}</p>
				</div>
			</Paper>
		);
	}
}
