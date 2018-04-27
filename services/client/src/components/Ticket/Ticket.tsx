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

		this.handleStatusChange = this.handleStatusChange.bind(this);
	}

	// TODO: Add componentDidUpdate when database is running on server
	//
	// public componentDidUpdate(prevProps: any) {
	// 	if (prevProps !== this.props) {
	// 		this.setState({ status: this.props.ticket.status});
	// 	}
	// }

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const { ticket, onSend } = this.props;

		return (
			<Card className='ticket'>
				<Span status={this.state.status} small={true} />
				<p className='ticket__id'>#{ticket.id}</p>
				<Link to={`ticket-${ticket.id}`} className='ticket__header'>
					<CardHeader
						title={ticket.title}
						subheader={ticket.from.name}
						classes={{title: 'ticket__header__title', subheader: 'ticket__header__subheader'}}
					/>
				</Link>
				<CardContent className='ticket__content'>
					<p className='ticket__content__information'>
						Mottaget: {this.getDateFormat(ticket.created)}
					</p>
					<p className='ticket__content__information'>Tilldelat:
						<span className='ticket__content__information--bold'>
							{ticket.assignee ? ` ${ticket.assignee}` : ' —'}
						</span>
					</p>
				</CardContent>
				<TicketAction
					ticket={ticket}
					onStatusChange={this.handleStatusChange}
					onSend={onSend}
				/>
			</Card>
		);
	}

	/**
	 * Formats ISO_8601 date to LL format (e.g. 28 April 2018)
	 * @private
	 * @param {String} date - The date string
	 */
	private getDateFormat(date: string): string {
		return moment(date, moment.ISO_8601).format('LL');
	}

	/**
	 * Handles status change for ticket by changing colors
	 * @private
	 * @param {Number} status - The status number
	 */
	private handleStatusChange(status: number): void {
		this.setState({ status });
	}
}
