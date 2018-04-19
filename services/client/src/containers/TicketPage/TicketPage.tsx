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
			ticket: false,
			showNewMessage: false,
			status: 0,
			assignee: data.assignee
		};

		this.handleNewMessageClick = this.handleNewMessageClick.bind(this);
		this.handleStatusChange = this.handleStatusChange.bind(this);
		this.handleAssigneeChange = this.handleAssigneeChange.bind(this);
		this.getMessage = this.getMessage.bind(this);
	}

	/**
	 * componentDidMount
	 * Set state with data for currently viewed ticket
	 * @public
	 */
	public componentDidMount() {
		const { pathname } = this.props.location;
		const ticketId = pathname[0] === '/' ? pathname.slice(8) : pathname.slice(7);

		this.props.tickets.forEach((ticket: any) => {
			if (ticket.id === Number(ticketId)) {
				this.setState({ ticket, status: ticket.status });
			}
		});
	}

	public render() {
		const ticket = this.state.ticket;
		const messages = ticket ? ticket.messages.map(this.getMessage) : [];

		return (
			<div className='ticket__wrapper'>
				<TicketOverview
					data={ticket}
					status={this.state.status}
					handleClick={this.handleNewMessageClick}
					handleStatusChange={this.handleStatusChange}
					handleAssigneeChange={this.handleAssigneeChange}
				/>
				<div className='ticket__wrapper__messages'>
					<MessageInput onClick={this.handleSend} open={this.state.showNewMessage} />
					{messages}
				</div>
			</div>
		);
	}

	/**
	 * Returns a Message component
	 * @private
	 * @param {Object} message - The message data
	 * @param {Number} i - Index in messages array
	 * @returns {Message} - A Message component
	 */
	private getMessage(message: any, i: number) {
		return (
			<Message
				key={i}
				data={message}
				customer={this.state.ticket.from.name}
				assignee={this.state.ticket.assignee}
			/>
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
		console.log('changed status to ' + status);
	}

	/**
	 * Handles assignee change of ticket
	 * @private
	 * @param {Number} assignee - The new assignee
	 */
	private handleAssigneeChange(assignee: string) {
		this.setState({ assignee });
		console.log('changed assignee to ' + assignee);
	}
}
