/**
 * Ticket component
 * @module components/Ticket/Ticket
 */

import * as React from 'react';
import { Link } from 'react-router';
import { Card, CardHeader, CardText } from 'material-ui';

import { ticketStyle } from '../../variables/Variables';

/**
 * Ticket Props Interface
 */
export interface ITicket { data: any; }

/**
 * Ticket class
 */
export class Ticket extends React.Component<ITicket, any> {

	public render() {
		const ticket = this.props.data;
		const colorClasses = `ticket__color ticket__color--${ticket.color}`;

		return (
			<Card style={ticketStyle.card}>
				<span className={colorClasses} />
				<p className='ticket__id'>#{ticket.id}</p>
				<Link to={`ticket-${ticket.id}`} className='ticket__header'>
					<CardHeader
						title={ticket.title}
						subtitle={ticket.author}
						textStyle={ticketStyle.header}
						titleStyle={ticketStyle.title}
						subtitleStyle={ticketStyle.subtitle}
					/>
				</Link>
				<CardText style={ticketStyle.text}>
					<p className='ticket__information'>Mottaget: {ticket.received}</p>
					<p className='ticket__information'>Tilldelat:
					<span className='ticket__information--bold'>{ticket.assigned}</span></p>
				</CardText>
			</Card>
		);
	}
}
