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
			snackMessage: '',
			snackState: false
		};

		this.handleNewMessageClick = this.handleNewMessageClick.bind(this);
		this.onStatusChange = this.onStatusChange.bind(this);
		this.onAssigneeChange = this.onAssigneeChange.bind(this);
		this.handleMessage = this.handleMessage.bind(this);
		this.getMessage = this.getMessage.bind(this);
	}

	public componentDidMount() {
		const { pathname } = this.props.location;
		const ticketId = pathname[0] === '/' ? pathname.slice(8) : pathname.slice(7);

		this.props.allTickets.forEach((ticket: any) => {
			if (ticket.id === Number(ticketId)) {
				this.setState({ ticket });
			}
		});
	}

	public componentDidUpdate(prevProps: any) {
		if (prevProps !== this.props) {
			const { pathname } = this.props.location;
			const ticketId = pathname[0] === '/' ? pathname.slice(8) : pathname.slice(7);

			this.props.allTickets.forEach((ticket: any) => {
				if (ticket.id === Number(ticketId)) {
					this.setState({ ticket });
				}
			});
		}
	}

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const messages = this.state.messages.map(this.getMessage);

		return (
			<div className='ticket__wrapper'>
				<TicketOverview
					handleClick={this.handleNewMessageClick}
					handleStatusChange={this.onStatusChange}
					handleAssigneeChange={this.onAssigneeChange}
					assignees={assignees}
					ticket={this.state.ticket}
				/>
				<div className='ticket__wrapper__messages'>
					<MessageInput
						open={this.state.showNewMessage}
						ticket={this.state.ticket}
						onClick={this.handleMessage}
					/>
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
	private handleMessage(ticket: any) {
		const messages = ticket.messages;
		console.log(messages);
		this.setState({ showNewMessage: false, messages });

		this.props.ticketAction.emitMessage({ ticket });
	}

	/**
	 * Handles status change of ticket
	 * @private
	 * @param {Number} status - The new status
	 */
	private onStatusChange(ticket: any, send: boolean) {
		this.setState({
			status: ticket.status,
			snackState: true,
			snackMessage: 'Status för ärendet har uppdaterats.'
		});
		this.props.ticketAction.emitStatus({ticket, send});
	}

	/**
	 * Handles assignee change of ticket
	 * @private
	 * @param {Number} assignee - The new assignee
	 */
	private onAssigneeChange(ticket: any) {
		this.setState({
			assignee: ticket.assignee,
			snackState: true,
			snackMessage: `Ärendet har tilldelats ${ticket.assignee}.`
		});
		this.props.ticketAction.emitAssignee(ticket);
	}

	/**
	 * Handles manual close of SnackbarNotice
	 * @private
	 */
	private handleSnackbarClose = (event: any) => {
		this.setState({ snackState: false });
	}
}
