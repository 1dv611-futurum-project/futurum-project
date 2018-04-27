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

/**
 * TicketPage class
 */
export class TicketPage extends React.Component<any, any> {

	constructor(props: any) {
		super(props);

		this.state = {
			ticket: false,
			showNewMessage: false,
			snackState: false
		};

		this.handleNewMessageClick = this.handleNewMessageClick.bind(this);
		this.onStatusChange = this.onStatusChange.bind(this);
		this.onAssigneeChange = this.onAssigneeChange.bind(this);
		this.handleMessage = this.handleMessage.bind(this);
	}

	public componentDidMount() {
		const ticketId = this.getCurrentTicketId(this.props.location.pathname);
		this.setTicket(this.props.allTickets, ticketId);
	}

	public componentDidUpdate(prevProps: any) {
		if (prevProps !== this.props) {
			const ticketId = this.getCurrentTicketId(this.props.location.pathname);
			this.setTicket(this.props.allTickets, ticketId);
		}
	}

	/**
	 * The render method
	 * @public
	 */
	public render() {
		return (
			<div className='ticket__wrapper'>
				<TicketOverview
					handleClick={this.handleNewMessageClick}
					handleStatusChange={this.onStatusChange}
					handleAssigneeChange={this.onAssigneeChange}
					assignees={this.props.allAssignees}
					ticket={this.state.ticket}
				/>
				<div className='ticket__wrapper__messages'>
					<MessageInput
						open={this.state.showNewMessage}
						ticket={this.state.ticket}
						onClick={this.handleMessage}
					/>
					{this.state.ticket.messages ?
						this.state.ticket.messages.map((message: any, i: number) => {
							return (
								<Message
									key={i}
									data={message}
									customer={this.state.ticket.from.name}
									assignee={this.state.ticket.assignee}
								/>
							);
						}).reverse() : null
					}
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
	 * Gets the current ticket ID
	 * @private
	 * @param pathname - the current path
	 */
	private getCurrentTicketId(pathname: string): any {
		return pathname[0] === '/' ? pathname.slice(8) : pathname.slice(7);
	}

	/**
	 * Sets the current ticket to state
	 * @private
	 * @param tickets - all tickets
	 */
	private setTicket(tickets: any[], id: string): any {
		tickets.forEach((ticket: any) => {
			if (ticket.id === Number(id)) {
				this.setState({ ticket });
			}
		});
	}

	/**
	 * Handles status change of ticket
	 * @private
	 * @param {Number} status - The new status
	 */
	private onStatusChange(ticket: any, send: boolean) {
		const snackMessage = send ? 'Status för ärendet har uppdaterats och skickats till kund.' :
			'Status för ärendet har uppdaterats.';

		this.setState({ ticket });
		this.handleSnackbar(snackMessage);
		this.props.ticketAction.emitStatus({ticket, send});
	}

	/**
	 * Handles assignee change of ticket
	 * @private
	 * @param {Number} assignee - The new assignee
	 */
	private onAssigneeChange(ticket: any) {
		this.setState({ ticket });
		this.handleSnackbar(`Ärendet har tilldelats ${ticket.assignee}.`);
		this.props.ticketAction.emitAssignee(ticket);
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
		this.setState({ ticket, showNewMessage: false });
		this.props.ticketAction.emitMessage({ ticket });
	}

	/**
	 * Activates and sets snackbar
	 * @private
	 * @param {String} snackMessage - The message
	 */
	private handleSnackbar(snackMessage: string) {
		this.setState({ snackState: true, snackMessage });
	}

	/**
	 * Handles manual close of SnackbarNotice
	 * @private
	 */
	private handleSnackbarClose = (event: any) => {
		this.setState({ snackState: false });
	}
}
