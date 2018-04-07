/**
 * Ticket component
 * @module components/Ticket/Ticket
 */

import * as React from 'react';
import { Link } from 'react-router';
import { Card, CardHeader, CardContent, CardActions } from 'material-ui';
import { StatusSelect } from '../StatusSelect/StatusSelect';

/**
 * Ticket Props Interface
 */
export interface ITicket {
	data: any;
}

/**
 * Ticket class
 */
export class Ticket extends React.Component<ITicket, any> {

	constructor(props: any) {
		super(props);
		this.state = {
			color: this.props.data.color || 'red'
		};

		this.handleStatusChange = this.handleStatusChange.bind(this);
	}

	public render() {
		const ticket = this.props.data;
		const colorClasses = `ticket__color ticket__color--${this.state.color}`;

		return (
			<Card className='ticket'>
				<span className={colorClasses} />
				<p className='ticket__id'>#{ticket.id}</p>
				<Link to={`ticket-${ticket.id}`} className='ticket__header'>
					<CardHeader
						title={ticket.title}
						subheader={ticket.author}
						classes={{title: 'ticket__header__title', subheader: 'ticket__header__subheader'}}
					/>
				</Link>
				<CardContent className='ticket__content'>
					<p className='ticket__content__information'>Mottaget: {ticket.created}</p>
					<p className='ticket__content__information'>Tilldelat:
						<span className='ticket__content__information--bold'> {ticket.assigned ? ticket.assigned : '-'}</span>
					</p>
				</CardContent>
				<CardActions className='ticket__actions'>
					<StatusSelect status={ticket.status} onChange={this.handleStatusChange} />
				</CardActions>
			</Card>
		);
	}

	/**
	 * Handles status change for ticket by changing colors
	 * @private
	 */
	private handleStatusChange(status: string): void {
		switch (status) {
			case 'Ej påbörjad':
				this.setState({ color: 'red' });
				break;
			case 'Påbörjad':
				this.setState({ color: 'blue' });
				break;
			case 'Genomförd':
			case 'Stängd':
				this.setState({ color: 'green' });
				break;
		}
	}
}
