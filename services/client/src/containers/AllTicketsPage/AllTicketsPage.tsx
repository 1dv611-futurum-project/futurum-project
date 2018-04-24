/**
 * AllTicketsPage container
 * @module containers/AllTicketsPage/AllTicketsPage
 */

import * as React from 'react';
import { Ticket } from '../../components/Ticket/Ticket';
import { SnackbarNotice } from '../../components/SnackbarNotice/SnackbarNotice';

/**
 * AllTicketsPage class
 */
export class AllTicketsPage extends React.Component<any, any> {

	constructor(props: any) {
		super(props);
		this.state = {
			snackMessage: '',
			snackState: false
		};

		this.getTickets = this.getTickets.bind(this);
		this.onStatusChange = this.onStatusChange.bind(this);
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
				<SnackbarNotice
					message={this.state.snackMessage}
					open={this.state.snackState}
					onClose={this.handleSnackbarClose}
				/>
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
		const ticketJsx = <Ticket key={i} ticket={ticket} onSend={this.onStatusChange} />;

		if (location.indexOf('open') !== -1 && ticket.status === 0) {
			return ticketJsx;
		} else if (location.indexOf('in-progress') !== -1 && ticket.status === 1) {
			return ticketJsx;
		} else if (location.indexOf('closed') !== -1 && ticket.status === 2 || ticket.status === 3) {
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
	 * @param {String} status - The new status
	 * @param {Boolean} mailCustomer - If customer should get an email about the status change
	 */
	private onStatusChange(ticket: any, send: boolean) {
		const snackMessage = send ? 'Status för ärendet har uppdaterats och skickats till kund.' :
			'Status för ärendet har uppdaterats.';
		this.setState({
			snackState: true,
			snackMessage
		});

		this.props.ticketAction.emitStatus({ ticket, send });
	}

	/**
	 * Handles manual close of SnackbarNotice
	 * @private
	 */
	private handleSnackbarClose = (event: any) => {
		this.setState({ snackState: false });
	}
}
