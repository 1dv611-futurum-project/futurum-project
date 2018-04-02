/**
 * Ticket component
 * @module components/Ticket/Ticket
 */

import * as React from 'react';
import { Link } from 'react-router';
import { Card, CardHeader, CardText } from 'material-ui';

/* Custom Material Design styling */
const style = {
	card: {
		width: 290,
		position: 'relative' as 'relative',
		margin: '0 10px 20px 10px'
	},
	header: {
		paddingRight: 0
	},
	title: {
		marginTop: '10px',
		fontWeight: 'bold' as 'bold',
		fontSize: '14px'
	},
	subtitle: {
		fontSize: '12px'
	},
	text: {
		paddingTop: 0
	}
};

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
			<Card style={style.card}>
				<span className={colorClasses} />
				<p className='ticket__id'>#{ticket.id}</p>
				<Link to={`ticket-${ticket.id}`} className='ticket__header'>
					<CardHeader
						title={ticket.title}
						subtitle={ticket.author}
						textStyle={style.header}
						titleStyle={style.title}
						subtitleStyle={style.subtitle}
					/>
				</Link>
				<CardText style={style.text}>
					<p className='ticket__information'>Mottaget: {ticket.received}</p>
					<p className='ticket__information'>Tilldelat:
					<span className='ticket__information--bold'>{ticket.assigned}</span></p>
				</CardText>
			</Card>
		);
	}
}
