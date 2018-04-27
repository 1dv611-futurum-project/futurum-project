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

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const { body, fromCustomer, received } = this.props.data;
		const { customer } = this.props;
		const assignee = this.props.assignee === null ? 'Futurum Digital' : this.props.assignee;

		return (
			<Paper className='message'>
				<Avatar className='message__avatar'>
					<Person className='message__avatar__icon'/>
				</Avatar>
				<div className='message__content'>
					<p className='message__content__title'>
						{fromCustomer ? customer : assignee},
						<span className='message__content__title--regular'>
							{` ${this.getDateFormat(received)}`}
						</span>
					</p>
					<p className='message__content__text'>{body}</p>
				</div>
			</Paper>
		);
	}

	/**
	 * Formats ISO_8601 date to L format (e.g. 2018-04-17)
	 * @private
	 * @param {String} date - The date string
	 */
	private getDateFormat(date: string): string {
		return moment(date, moment.ISO_8601).format('L');
	}
}
