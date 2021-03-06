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
import Span from '../../elements/CustomSpan/CustomSpan';

/**
 * Ticket Props Interface
 */
export interface ITicket {
	ticket: any;
	onSend(ticket: any, send: boolean): void;
}

/**
 * Ticket class
 */
export class Ticket extends React.Component<ITicket, any> {

	constructor(props: any) {
		super(props);
		this.state = {
			status: this.props.ticket.status
		};
	}

	/**
	 * componentDidUpdate
	 * Updates current ticket in state
	 * @public
	 * @param {Object} prevProps - The previous props
	 */
	public componentDidUpdate(prevProps: any) {
		if (prevProps !== this.props) {
			const status = this.props.ticket.status;
			this.setState({ status });
		}
	}

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const { ticket, onSend } = this.props;

		return (
			<Card className='ticket'>
				<Span status={this.state.status} small={true} />
				<p className='ticket__id'>#{ticket.ticketId}</p>
				<Link to={`ticket-${ticket.ticketId}`} className='ticket__header'>
					<CardHeader
						title={ticket.title}
						subheader={ticket.from.name}
						classes={{ title: 'ticket__header__title', subheader: 'ticket__header__subheader' }}
					/>
				</Link>
				<CardContent className='ticket__content'>
					<p className='ticket__content__information'>
						Mottaget: {this.getFormattedDate(ticket.created)}
					</p>
					<p className='ticket__content__information'>Tilldelat:
						<span className='ticket__content__information--bold'>
							{ticket.assignee ? ` ${ticket.assignee.name}` : ' —'}
						</span>
					</p>
				</CardContent>
				<TicketAction
					ticket={ticket}
					onSend={onSend}
				/>
			</Card>
		);
	}

	/**
	 * Formats ISO_8601 date to LL format (e.g. 28 April 2018)
	 * @private
	 * @param {String} date - The date string
	 * @returns {String} - The formatted date
	 */
	private getFormattedDate(date: string): string {
		return moment(date, moment.ISO_8601).format('LL');
	}
}
