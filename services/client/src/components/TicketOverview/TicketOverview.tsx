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
	handleStatusChange(status: number): any;
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

	public componentDidMount() {
		let status = this.props.status;

		switch (this.props.status) {
			case 0:
				this.setState({ color: 'red', status: status });
				break;
			case 1:
				this.setState({ color: 'blue', status: status });
				break;
			case 2:
			case 3:
				this.setState({ color: 'green', status: status });
				break;
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
