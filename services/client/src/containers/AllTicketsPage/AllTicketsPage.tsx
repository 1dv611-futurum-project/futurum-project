/**
 * AllTicketsPage container
 * @module containers/AllTicketsPage/AllTicketsPage
 */
import * as React from 'react';
import { Badge } from 'material-ui';
import { Mail } from 'material-ui-icons';
import { Ticket } from '../../components/Ticket/Ticket';

/**
 * AllTicketsPage class
 */
export class AllTicketsPage extends React.Component<any, any> {

	constructor(props: any) {
		super(props);

		this.getTickets = this.getTickets.bind(this);
	}

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const title = this.getTitle();
		const tickets = this.props.allTickets.map(this.getTickets).filter((ticket: any) => ticket !== undefined);

		return (
			<div className='tickets'>
				<h1 className='tickets__header'>{title} ({tickets.length})</h1>
				<div className='tickets__wrapper'>
					{tickets.reverse()}
				</div>
			</div>
		);
	}

	/**
	 * Returns the correct page title based on filtering
	 * @private
	 * @returns {String} - The page title
	 */
	private getTitle(): string {
		switch (this.props.location.pathname) {
			case '/':
				return 'Alla ärenden';
			case '/open':
				return 'Ej påbörjade ärenden';
			case '/in-progress':
				return 'Påbörjade ärenden';
			case '/closed':
				return 'Avslutade ärenden';
		}
	}

	/**
	 * Retrieves the desired tickets based on filtering
	 * @private
	 * @param {Object} ticket - The ticket data
	 * @param {Number} i - The array index
	 * @returns {Ticket} - A Ticket component
	 */
	private getTickets(ticket: any, i: any): any {
		const location = this.props.location.pathname;
		const ticketJsx = ticket.isRead ?
				<Ticket key={i} ticket={ticket} onSend={this.onStatusChange} />
			: this.notification(ticket, i);

		if (location.indexOf('open') !== -1 && ticket.status === 0) {
			return ticketJsx;
		} else if (location.indexOf('in-progress') !== -1 && ticket.status === 1) {
			return ticketJsx;
		} else if (location.indexOf('closed') !== -1 && (ticket.status === 2 || ticket.status === 3)) {
			return ticketJsx;
		} else if (location === '/') {
			return ticketJsx;
		} else {
			return;
		}
	}

	/**
	 * Handles status change on tickets
	 * @private
	 * @param {String} ticket - The full ticket data
	 * @param {Number} i - The array index
	 */
	private notification(ticket: any, i: number) {
		return (
			<Badge className='ticket__badge' badgeContent={<Mail />} color='secondary' key={i}>
				<Ticket key={i} ticket={ticket} onSend={this.onStatusChange} />
			</Badge>
		);
	}

	/**
	 * Handles status change on tickets
	 * @private
	 * @param {String} ticket - The full ticket data
	 * @param {Boolean} send - If customer should get an email about the status change
	 */
	private onStatusChange = (ticket: any, send: boolean) => {
		this.props.ticketAction.emitStatus({ ticket, send });
	}
}
