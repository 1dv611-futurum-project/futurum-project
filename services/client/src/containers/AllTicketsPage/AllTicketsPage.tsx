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
		const statuses = ['Ej påbörjad', 'Påbörjad', 'Genomförd'];
		const author = 'Johan Andersson';
		const assigned = 'Anton Myrberg';
		const received = '2 april 2018';

		titles.forEach((title, i) => {
			this.tickets.push({
				color: colors[this.index],
				title: titles[this.index],
				author: author,
				assigned: assigned,
				received: received,
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
		const tickets = this.state.tickets.map((ticket: any, i: any) => <Ticket key={i} data={ticket} />);

		return (
			<div className='tickets__wrapper'>
				{tickets}
			</div>
		);
	}
}