/**
 * TicketOverview component
 * @module components/TicketOverview/TicketOverview
 */

import * as React from 'react';
import { Paper } from 'material-ui';
import { PlayArrow } from 'material-ui-icons';

import { StatusSelect } from '../StatusSelect/StatusSelect';

/**
 * TicketOverview class
 */
export class TicketOverview extends React.Component<{}, any> {

	constructor(props: any) {
		super(props);
	}

	public render() {
		// const { title, created, status, assigned, id, author } = this.props.data;

		return (
			<Paper className='ticket-overview'>
				<span className='ticket-overview__color ticket-overview__color--blue' />
				<div className='ticket-overview__header'>
					<PlayArrow className='ticket-overview__header__icon'/>
					<h1 className='ticket-overview__header__title'>
						<span className='ticket-overview__header__title--grey'>#32 — </span>
						Applikationen fungerar inte
					</h1>
				</div>
				<StatusSelect status='Ej påbörjad' onChange={() => {}} />
			</Paper>
		);
	}
}
