/**
 * TicketPage container
 * @module containers/TicketPage/TicketPage
 */

import * as React from 'react';
import * as moment from 'moment';
import 'moment/locale/sv';

import { TicketOverview } from '../../components/TicketOverview/TicketOverview';
import { Message } from '../../components/Message/Message';
import { MessageInput } from '../../components/MessageInput/MessageInput';
import { SnackbarNotice } from '../../components/SnackbarNotice/SnackbarNotice';

const assignees = ['Anton Myrberg', 'Sebastian Borgstedt'];

/**
 * TicketPage class
 */
export class TicketPage extends React.Component<any, any> {

	constructor(props: any) {
		super(props);

		this.state = {
			ticket: false,
			messages: [],
			showNewMessage: false,
			status: 0,
			assignee: null,
			snackMessage: '',
			snackState: false
		};

		this.handleNewMessageClick = this.handleNewMessageClick.bind(this);
		this.handleStatusChange = this.handleStatusChange.bind(this);
		this.handleAssigneeChange = this.handleAssigneeChange.bind(this);
		this.handleSend = this.handleSend.bind(this);
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

		this.props.allTickets.forEach((ticket: any) => {
			if (ticket.id === Number(ticketId)) {
				this.setState({
					ticket,
					messages: ticket.messages,
					status: ticket.status,
					assignee: ticket.assignee
				});
			}
		});
	}

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const ticket = this.state.ticket;
		const messages = this.state.messages.map(this.getMessage);

		return (
			<div className='ticket__wrapper'>
				<TicketOverview
					handleClick={this.handleNewMessageClick}
					handleStatusChange={this.handleStatusChange}
					handleAssigneeChange={this.handleAssigneeChange}
					assignees={assignees}
					data={ticket}
				/>
				<div className='ticket__wrapper__messages'>
					<MessageInput onClick={this.handleSend} open={this.state.showNewMessage} />
					{messages}
				</div>
				<SnackbarNotice
					message={this.state.snackMessage}
					open={this.state.snackState}
					onClose={this.handleSnackbarClose}
				/>
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
		const messages = this.state.messages;
		const newMessage = {
			fromCustomer: false,
			received: moment().format(),
			body: message
		};

		messages.unshift(newMessage);
		this.setState({ showNewMessage: false, messages });

		this.props.ticketAction.emitMail(message);
	}

	/**
	 * Handles status change of ticket
	 * @private
	 * @param {Number} status - The new status
	 */
	private handleStatusChange(status: number) {
		this.setState({
			status,
			snackState: true,
			snackMessage: 'Status för ärendet har uppdaterats.'
		});
		this.props.ticketAction.emitStatus(status);
	}

	/**
	 * Handles assignee change of ticket
	 * @private
	 * @param {Number} assignee - The new assignee
	 */
	private handleAssigneeChange(assignee: string) {
		this.setState({
			assignee,
			snackState: true,
			snackMessage: `Ärendet har tilldelats ${assignee}.`
		});
		this.props.ticketAction.emitAssignee(status);
	}

	/**
	 * Handles manual close of SnackbarNotice
	 * @private
	 */
	private handleSnackbarClose = (event: any) => {
		this.setState({ snackState: false });
	}
}
