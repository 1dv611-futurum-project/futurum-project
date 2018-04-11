/**
 * TicketOverview component
 * @module components/TicketOverview/TicketOverview
 */

import * as React from 'react';
import { Paper } from 'material-ui';
import { PlayArrow } from 'material-ui-icons';

import { StatusSelect } from '../StatusSelect/StatusSelect';
import { AddButton } from '../AddButton/AddButton';

/**
 * TicketOverview Props Interface
 */
export interface ITicketOverview {
	handleClick(): any;
	handleStatusChange(status: string): any;
	status: string;
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
			status: ''
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
				case 'Ej påbörjad':
					status = 'red';
					break;
				case 'Påbörjad':
					status = 'blue';
					break;
				case 'Genomförd':
				case 'Stängd':
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
		const { handleClick, handleStatusChange } = this.props;
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
						<StatusSelect status={this.state.status} onChange={handleStatusChange} />
					</div>
					<div className='ticket-overview__actions--assigned'>
						<p className='ticket-overview__actions__label'>Tilldelad:</p>
						<StatusSelect status={this.state.status} onChange={handleStatusChange} />
					</div>
				</div>
			</Paper>
		);
	}
}
