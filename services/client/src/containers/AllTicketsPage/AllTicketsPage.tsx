/**
 * AllTicketsPage container
 * @module containers/AllTicketsPage/AllTicketsPage
 */

import * as React from 'react';
import { Ticket } from '../../components/Ticket/Ticket';

/**
 * AllTicketsPage class
 */
export class AllTicketsPage extends React.Component<any, any> {

	private tickets: any;
	private index: number;

	constructor(props: any) {
		super(props);
		this.state = {
			tickets: []
		};

		this.getTickets = this.getTickets.bind(this);
	}

	/**
	 * componentDidMount
	 * Creating tickets to display
	 * @public
	 */
	public componentDidMount() {
		this.tickets = [];
		this.index = 0;

		const colors = ['red', 'blue', 'green'];
		const titles = ['Vi har ett problem', 'Applikationen fungerar inte', 'Kan ni hjälpa oss?',
			'Vi har ett problem', 'Applikationen fungerar inte', 'Kan ni hjälpa oss?'];
		const statuses = ['0', '1', '2'];
		const author = 'Johan Andersson';
		const assignee = 'Anton Myrberg';
		const created = '2 april 2018';

		titles.forEach((title, i) => {
			this.tickets.push({
				color: colors[this.index],
				title: titles[this.index],
				author,
				assignee,
				created,
				status: statuses[this.index],
				id: i
			});
			this.index === 2 ? this.index = 0 : this.index++;
		});

		this.setState({
			tickets: this.tickets
		});
	}

	public render() {
		const tickets = this.state.tickets.map(this.getTickets).filter((ticket: any) => ticket !== undefined);
		const title = this.getTitle();

		return (
			<div className='tickets'>
				<h1 className='tickets__header'>{title} ({tickets.length})</h1>
				<div className='tickets__wrapper'>
					{tickets}
				</div>
			</div>
		);
	}

	/**
	 * Handles status change on tickets
	 * @private
	 * @param {String} status - The new status
	 */
	private sendStatusChange(status: string) {
		console.log(status);
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
		const ticketJsx = <Ticket key={i} data={ticket} onChange={this.sendStatusChange} />;

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
}
