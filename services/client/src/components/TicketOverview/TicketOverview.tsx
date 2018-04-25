/**
 * TicketOverview component
 * @module components/TicketOverview/TicketOverview
 */

import * as React from 'react';
import { Paper } from 'material-ui';
import { PlayArrow } from 'material-ui-icons';
import * as moment from 'moment';
import 'moment/locale/sv';

import { StatusSelect } from '../StatusSelect/StatusSelect';
import { DropDownSelect } from '../DropDownSelect/DropDownSelect';
import { AddButton } from '../AddButton/AddButton';
import { CustomSpan } from '../../elements/CustomSpan/CustomSpan';

/**
 * TicketOverview Props Interface
 */
export interface ITicketOverview {
	handleClick(): any;
	handleStatusChange(ticket: any, send: boolean): any;
	handleAssigneeChange(ticket: any): any;
	assignees: string[];
	ticket: any;
}

/**
 * TicketOverview class
 */
export class TicketOverview extends React.Component<ITicketOverview, any> {

	constructor(props: any) {
		super(props);

		this.state = {
			status: this.props.ticket.status,
			assignee: this.props.ticket.assignee
		};

		this.handleStatusChange = this.handleStatusChange.bind(this);
		this.handleAssigneeChange = this.handleAssigneeChange.bind(this);
	}

	/**
	 * componentDidUpdate - Update state to new props
	 * @public
	 * @param {any} prevProps
	 */
	public componentDidUpdate(prevProps: any): void {
		if (prevProps.ticket !== this.props.ticket) {
			const ticket = this.props.ticket;

			this.setState({
				status: ticket.status,
				assignee: ticket.assignee
			});
		}
	}

	/**
	 * The render method
	 * @public
	 */
	public render(): any {
		const { id, title, assignee, created, from } = this.props.ticket;
		const { handleClick, handleStatusChange, handleAssigneeChange } = this.props;

		return (
			<Paper className='ticket-overview'>
				<CustomSpan status={this.state.status} wide={true} />
				<div className='ticket-overview__header'>
					<PlayArrow className='ticket-overview__header__icon'/>
					<h1 className='ticket-overview__header__title'>
						<span className='ticket-overview__header__title--grey'>#{id} — </span>
						{title}
					</h1>
				</div>
				<div className='ticket-overview__info'>
					<p className='ticket-overview__info__text'>Ärende skapat av {from ? from.name : ''}</p>
					<p className='ticket-overview__info__text'>Mottaget {moment(created, moment.ISO_8601).format('LL')}</p>
					<AddButton text='Skriv ett svar' onClick={handleClick} />
				</div>
				<div className='ticket-overview__actions'>
					<div className='ticket-overview__actions--status'>
						<p className='ticket-overview__actions__label'>Status:</p>
						<StatusSelect
							selected={this.state.status}
							onChange={this.handleStatusChange}
						/>
					</div>
					<div className='ticket-overview__actions--assigned'>
						<p className='ticket-overview__actions__label'>Tilldelad:</p>
						<DropDownSelect
							selected={this.state.assignee}
							items={this.props.assignees}
							onChange={this.handleAssigneeChange}
						/>
					</div>
				</div>
			</Paper>
		);
	}

	/**
	 * Handles status change for ticket
	 * @private
	 * @param {number} status - The status number (0-3)
	 */
	private handleStatusChange(status: number): void {
		console.log(status);
		this.props.ticket.status = status;
		// TODO: Add modal for send ticket change or not
		this.props.handleStatusChange(this.props.ticket, false);
		this.setState({ status });
	}

	/**
	 * Handles assignee change for ticket
	 * @private
	 * @param {number} selected - The selected index
	 */
	private handleAssigneeChange(selected: number): void {
		this.props.ticket.assignee = this.props.assignees[selected];
		this.props.handleAssigneeChange(this.props.ticket);

		const assignee = this.props.assignees[selected];
		this.setState({ assignee });
	}
}
