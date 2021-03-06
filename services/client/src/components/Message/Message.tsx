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
		const { body, received, fromName } = this.props.data;

		return (
			<Paper className='message'>
				<Avatar className='message__avatar'>
					<Person className='message__avatar__icon'/>
				</Avatar>
				<div className='message__content'>
					<p className='message__content__title'>
						{fromName},
						<span className='message__content__title--regular'>
							{` ${this.getFormattedDate(received)}`}
						</span>
					</p>
					<p className='message__content__text'>
						{
							body ? body.split('\n').map((text: any, i: number) => {
								return <span key={i}>{text}<br/></span>;
							}) : ''
						}
					</p>
				</div>
			</Paper>
		);
	}

	/**
	 * Formats ISO_8601 date to L format (e.g. 2018-04-17)
	 * @private
	 * @param {String} date - The date string
	 * @returns {String} - The formatted date
	 */
	private getFormattedDate(date: string): string {
		return moment(date, moment.ISO_8601).format('L');
	}
}
