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

/**
 * TicketPage class
 */
export class TicketPage extends React.Component<any, any> {

	constructor(props: any) {
		super(props);

		this.state = {
			ticket: false,
			showNewMessage: false,
		};
	}

	/**
	 * componentDidMount
	 * Sets the correct ticket based on path
	 * @public
	 */
	public componentDidMount() {
		const ticketId = this.getCurrentTicketId(this.props.location.pathname);
		this.setTicket(this.props.allTickets, ticketId);
	}

	/**
	 * componentDidUpdate
	 * Sets the correct ticket based on path on props update
	 * @public
	 * @param {Object} prevProps - Previous props
	 */
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
					handleClick={() => this.setState({ showNewMessage: !this.state.showNewMessage })}
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
					{
						this.state.ticket.body ?
						this.state.ticket.body.map((message: any, i: number) => {
							return <Message key={i} data={message} />;
						}).reverse() : null
					}
				</div>
			</div>
		);
	}

	/**
	 * Gets the current ticket ID
	 * @private
	 * @param {String} pathname - The current path
	 */
	private getCurrentTicketId(pathname: string): any {
		return pathname[0] === '/' ? pathname.slice(8) : pathname.slice(7);
	}

	/**
	 * Sets the current ticket to state
	 * @private
	 * @param {Object} tickets - All tickets
	 * @param {String} id - The current ticket ID
	 */
	private setTicket(tickets: any[], id: string): any {
		tickets.forEach((ticket: any) => {
			if (ticket.ticketId === Number(id)) {
				this.onVisit(ticket);
				this.setState({ ticket });
			}
		});
	}

	/**
	 * Handles isRead change when ticket is visited
	 * @private
	 * @param {Object} ticket - The full ticket data
	 */
	private onVisit(ticket: any) {
		ticket.isRead = true;
		this.props.ticketAction.emitRead({ticket});
	}

	/**
	 * Handles status change of ticket
	 * @private
	 * @param {Object} ticket - The full ticket data
	 * @param {Boolean} send - If an email should be sent to client about status update
	 */
	private onStatusChange = (ticket: any, send: boolean) => {
		this.props.ticketAction.emitStatus({ticket, send});
	}

	/**
	 * Handles assignee change of ticket
	 * @private
	 * @param {Number} assignee - The new assignee
	 */
	private onAssigneeChange = (ticket: any) => {
		this.props.ticketAction.emitAssignee({ ticket });
	}

	/**
	 * Handles a new message being sent
	 * @private
	 * @param {String} message - The written message
	 */
	private handleMessage = (ticket: any) => {
		this.setState({ showNewMessage: false });
		this.props.ticketAction.emitMessage({ ticket });
	}
}
