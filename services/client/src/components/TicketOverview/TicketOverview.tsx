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

/**
 * TicketOverview Props Interface
 */
export interface ITicketOverview {
	handleClick(): any;
	handleStatusChange(status: number): any;
	handleAssigneeChange(assignee: string): any;
	assignees: string[];
	data: any;
}

/**
 * TicketOverview class
 */
export class TicketOverview extends React.Component<ITicketOverview, any> {

	constructor(props: any) {
		super(props);
		this.state = {
			color: '',
			status: this.props.data.status || -1,
			assignee: this.props.data.assignee || ''
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
		if (prevProps.data !== this.props.data) {
			const ticket = this.props.data;
			this.setState({
				color: this.getStatusColor(ticket.status),
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
		const { id, title, assignee, created, from } = this.props.data;
		const { handleClick, handleStatusChange, handleAssigneeChange } = this.props;

		return (
			<Paper className='ticket-overview'>
				<span className={`ticket-overview__color ticket-overview__color--${this.state.color}`}/>
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
	 * Gets the status color
	 * @private
	 * @param {number} status - The status number (0-3)
	 */
	private getStatusColor(status: number): string {
		switch (status) {
			case 0:
				return'red';
			case 1:
				return 'blue';
			case 2:
			case 3:
				return 'green';
		}
	}

	/**
	 * Handles status change for ticket
	 * @private
	 * @param {number} status - The status number (0-3)
	 */
	private handleStatusChange(status: number): void {
		const color = this.getStatusColor(status);

		this.props.handleStatusChange(status);
		this.setState({ color, status });
	}

	/**
	 * Handles assignee change for ticket
	 * @private
	 * @param {number} selected - The selected index
	 */
	private handleAssigneeChange(selected: number): void {
		const assignee = this.props.assignees[selected];

		this.props.handleAssigneeChange(assignee);
		this.setState({ assignee });
	}
}
