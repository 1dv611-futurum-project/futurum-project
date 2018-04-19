/**
 * Ticket component
 * @module components/Ticket/Ticket
 */

import * as React from 'react';
import { Link } from 'react-router';
import { Card, CardHeader, CardContent, CardActions } from 'material-ui';
import * as moment from 'moment';
import 'moment/locale/sv';
import { TicketAction } from './TicketAction';

/**
 * Ticket Props Interface
 */
export interface ITicket {
	data: any;
	onSend(message: any): void;
}

/**
 * Ticket class
 */
export class Ticket extends React.Component<ITicket, any> {

	constructor(props: any) {
		super(props);
		this.state = {
			color: 'red'
		};

		this.handleStatusColor = this.handleStatusColor.bind(this);
	}

	/**
	 * componentDidMount
	 * Initiates status color from ticket data
	 */
	public componentDidMount() {
		this.handleStatusColor(this.props.data.status);
	}

	/**
	 * The render method
	 * @public
	 */
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
						subheader={ticket.from.name}
						classes={{title: 'ticket__header__title', subheader: 'ticket__header__subheader'}}
					/>
				</Link>
				<CardContent className='ticket__content'>
					<p className='ticket__content__information'>Mottaget: {moment(ticket.created, moment.ISO_8601).format('LL')}</p>
					<p className='ticket__content__information'>Tilldelat:
						<span className='ticket__content__information--bold'> {ticket.assignee ? ticket.assignee : '—'}</span>
					</p>
				</CardContent>
				<TicketAction
					data={ticket}
					onStatusChange={this.handleStatusColor}
					onSend={this.props.onSend}
				/>
			</Card>
		);
	}

	/**
	 * Handles status change for ticket by changing colors
	 * @private
	 * @param {Number} status - The status number
	 */
	private handleStatusColor(status: number): void {
		switch (status) {
			case 0:
				this.setState({ color: 'red' });
				break;
			case 1:
				this.setState({ color: 'blue' });
				break;
			case 2:
			case 3:
				this.setState({ color: 'green' });
				break;
		}
	}
}
