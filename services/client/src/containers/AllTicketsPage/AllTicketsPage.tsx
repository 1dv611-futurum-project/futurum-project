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
		const created = '2 april 2018';

		titles.forEach((title, i) => {
			this.tickets.push({
				color: colors[this.index],
				title: titles[this.index],
				author,
				assigned,
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
		const tickets = this.state.tickets.map((ticket: any, i: any) => 
			<Ticket key={i} data={ticket} onChange={this.sendStatusChange} />);

		return (
			<div className='tickets'>
				<h1 className='tickets__header'>Alla ärenden (20)</h1>
				<div className='tickets__wrapper'>
					{tickets}
				</div>
			</div>
		);
	}

	private sendStatusChange(status: string) {
		console.log(status);
	}
}
