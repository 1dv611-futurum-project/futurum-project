/**
 * TicketPage container
 * @module containers/TicketPage/TicketPage
 */

import * as React from 'react';
import { TicketOverview } from '../../components/TicketOverview/TicketOverview';
import { Message } from '../../components/Message/Message';
import { MessageInput } from '../../components/MessageInput/MessageInput';

/**
 * TicketPage class
 */
export class TicketPage extends React.Component<any, any> {

	constructor(props: any) {
		super(props);

		this.state = {
			showNewMessage: false,
			status: 'Påbörjad'
		};

		this.handleNewMessageClick = this.handleNewMessageClick.bind(this);
		this.handleStatusChange = this.handleStatusChange.bind(this);
	}

	public render() {
		const message = {
			author: 'Johan Andersson',
			date: '2018-04-05',
			message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce turpis est, iaculis sit amet ultrices luctus, hendrerit non metus. Nullam eget vehicula justo, at suscipit nisi. In hac habitasse platea dictumst. Sed aliquet congue justo eu pellentesque. Sed non aliquet ligula. Donec maximus, justo eget egestas varius, sem nunc rutrum libero, quis faucibus arcu lorem eu magna. Fusce ut augue justo. Phasellus consectetur dui at ligula placerat tincidunt.'
		};

		return (
			<div className='ticket__wrapper'>
				<TicketOverview
					status={this.state.status}
					handleClick={this.handleNewMessageClick}
					handleStatusChange={this.handleStatusChange}
				/>
				<div className='ticket__wrapper__messages'>
					<MessageInput onClick={this.handleSend} open={this.state.showNewMessage} />
					<Message data={message}/>
					<Message data={message}/>
					<Message data={message}/>
				</div>
			</div>
		);
	}

	/**
	 * Handles click on New message button
	 * @private
	 */
	private handleNewMessageClick() {
		this.setState({ showNewMessage: true });
	}

	/**
	 * Handles a new message being sent
	 * @private
	 * @param {String} message - The written message
	 */
	private handleSend(message: string) {
		console.log(message);

		// TODO! Handle message here.
	}

	/**
	 * Handles status change of ticket
	 * @private
	 * @param {String} status - The new status
	 */
	private handleStatusChange(status: string) {
		this.setState({ status });
	}
}
