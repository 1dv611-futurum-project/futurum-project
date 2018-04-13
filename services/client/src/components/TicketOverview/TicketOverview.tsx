/**
 * TicketOverview component
 * @module components/TicketOverview/TicketOverview
 */

import * as React from 'react';
import { Paper } from 'material-ui';
import { PlayArrow } from 'material-ui-icons';

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
	status: number;
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
			status: 0
		};
	}

	/**
	 * getDerivedStateFromProps
	 * Sets the correct ticket color based on status.
	 * @public
	 * @param {Object} nextProps
	 * @param {Object} prevState
	 * @returns {Object} - The state object
	 */
	public static getDerivedStateFromProps(nextProps: any, prevState: any) {
		if (nextProps.status !== prevState.status || prevState.status === '') {
			let status;
			switch (nextProps.status) {
				case 0:
					status = 'red';
					break;
				case 1:
					status = 'blue';
					break;
				case 2:
				case 3:
					status = 'green';
					break;
			}

			return {
				color: status,
				status: nextProps.status
			};
		} else {
			return null;
		}
	}

	public render() {
		const { id, assignee, title, created, from } = this.props.data;
		const { handleClick, handleStatusChange, handleAssigneeChange } = this.props;
		const assignees = ['Anton Myrberg', 'Sebastian Borgstedt'];
		const colorClasses = `ticket-overview__color ticket-overview__color--${this.state.color}`;

		return (
			<Paper className='ticket-overview'>
				<span className={colorClasses} />
				<div className='ticket-overview__header'>
					<PlayArrow className='ticket-overview__header__icon'/>
					<h1 className='ticket-overview__header__title'>
						<span className='ticket-overview__header__title--grey'>#{id} — </span>
						{title}
					</h1>
				</div>
				<div className='ticket-overview__info'>
					<p className='ticket-overview__info__text'>Ärende skapat av {from.name}</p>
					<p className='ticket-overview__info__text'>Mottaget {created}</p>
					<AddButton text='Skriv ett svar' onClick={handleClick} />
				</div>
				<div className='ticket-overview__actions'>
					<div className='ticket-overview__actions--status'>
						<p className='ticket-overview__actions__label'>Status:</p>
						<StatusSelect selected={this.state.status} onChange={handleStatusChange} />
					</div>
					<div className='ticket-overview__actions--assigned'>
						<p className='ticket-overview__actions__label'>Tilldelad:</p>
						<DropDownSelect selected={assignee} onChange={handleAssigneeChange} items={assignees} />
					</div>
				</div>
			</Paper>
		);
	}
}
