/**
 * TicketPage container
 * @module containers/TicketPage/TicketPage
 */

import * as React from 'react';
import { TicketOverview } from '../../components/TicketOverview/TicketOverview';
import { Message } from '../../components/Message/Message';
import { MessageInput } from '../../components/MessageInput/MessageInput';

// TODO! Remove mock-up data
const data = {
	id: '13',
	status: 1,
	assignee: 'Anton Myrberg',
	title: 'Applikationen fungerar inte',
	created: '2018-04-04',
	from: {
		name: 'Johan Andersson',
		email: 'kunden@kunden.se'
	},
	messages: [
		{
			received: '2018-04-10',
			from: 'Anton Myrberg',
			body: 'Hej!\nVi har tagit emot ditt meddelande.\nMvh Anton Myrberg, Futurum Digital'
		},
		{
			received: '2018-04-04',
			from: 'Johan Andersson',
			body: 'Hej!\nVi har stött på ett problem som vi hade behövt hjälp med. Vänligen återkoppla!\n/Johan'
		}
	]
};

/**
 * TicketPage class
 */
export class TicketPage extends React.Component<any, any> {

	constructor(props: any) {
		super(props);

		this.state = {
			showNewMessage: false,
			status: data.status
		};

		this.handleNewMessageClick = this.handleNewMessageClick.bind(this);
		this.handleStatusChange = this.handleStatusChange.bind(this);
	}

	public render() {
		const messages = data.messages.map((message, i) => <Message key={i} data={message}/>);

		return (
			<div className='ticket__wrapper'>
				<TicketOverview
					data={data}
					status={this.state.status}
					handleClick={this.handleNewMessageClick}
					handleStatusChange={this.handleStatusChange}
				/>
				<div className='ticket__wrapper__messages'>
					<MessageInput onClick={this.handleSend} open={this.state.showNewMessage} />
					{messages}
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
	 * @param {Number} status - The new status
	 */
	private handleStatusChange(status: number) {
		this.setState({ status });
	}
}
