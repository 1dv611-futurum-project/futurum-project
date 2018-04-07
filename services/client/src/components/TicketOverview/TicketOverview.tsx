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
}

/**
 * TicketOverview class
 */
export class TicketOverview extends React.Component<ITicketOverview, any> {

	constructor(props: any) {
		super(props);
	}

	public render() {
		// const { title, created, status, assigned, id, author } = this.props.data;
		const { handleClick, handleStatusChange, status } = this.props;
		const color = this.setStatusColor(status);
		const colorClasses = `ticket-overview__color ticket-overview__color--${color}`;

		return (
			<Paper className='ticket-overview'>
				<span className={colorClasses} />
				<div className='ticket-overview__header'>
					<PlayArrow className='ticket-overview__header__icon'/>
					<h1 className='ticket-overview__header__title'>
						<span className='ticket-overview__header__title--grey'>#32 — </span>
						Applikationen fungerar inte
					</h1>
				</div>
				<div className='ticket-overview__info'>
					<p className='ticket-overview__info__text'>Ärende skapat av Johan Andersson</p>
					<p className='ticket-overview__info__text'>Mottaget 6 april 2018</p>
					<AddButton text='Skriv ett svar' onClick={handleClick} />
				</div>
				<div className='ticket-overview__actions'>
					<div className='ticket-overview__actions--status'>
						<p className='ticket-overview__actions__label'>Status:</p>
						<StatusSelect status={status} onChange={handleStatusChange} />
					</div>
					<div className='ticket-overview__actions--assigned'>
						<p className='ticket-overview__actions__label'>Tilldelad:</p>
						<StatusSelect status={status} onChange={handleStatusChange} />
					</div>
				</div>
			</Paper>
		);
	}

	/**
	 * Sets the correct status color
	 * @private
	 * @param {String} status - The new status
	 */
	private setStatusColor(status: string) {
		switch (status) {
			case 'Ej påbörjad':
				return 'red';
			case 'Påbörjad':
				return 'blue';
			case 'Genomförd':
			case 'Stängd':
				return 'green';
		}
	}
}
