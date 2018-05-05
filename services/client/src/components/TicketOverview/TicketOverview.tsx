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
import { Modal } from '../Modal/Modal';
import Span from '../../elements/CustomSpan/CustomSpan';

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
			displayModal: false,
			status: this.props.ticket.status,
			assignee: this.props.ticket.assignee,
			statusText: ''
		};
	}

	/**
	 * componentDidUpdate - Update state to new props
	 * @public
	 * @param {Object} prevProps - The previous props
	 */
	public componentDidUpdate(prevProps: any): void {
		if (prevProps.ticket !== this.props.ticket) {
			const { status, assignee } = this.props.ticket;
			this.setState({ status, assignee });
		}
	}

	/**
	 * The render method
	 * @public
	 */
	public render(): any {
		const { ticketId, title, created, from } = this.props.ticket;
		const { handleClick, handleStatusChange, handleAssigneeChange } = this.props;
		const assignees = this.props.assignees.map((assignee: any) => {
			return assignee.name;
		});

		return (
			<Paper className='ticket-overview'>
				<Span status={this.state.status} wide={true} />
				<div className='ticket-overview__header'>
					<PlayArrow className='ticket-overview__header__icon'/>
					<h1 className='ticket-overview__header__title'>
						<span className='ticket-overview__header__title--grey'>#{ticketId} — </span>
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
						{this.state.displayModal ?
							<Modal
								title={`Uppdatering av status för ärendet "${title}"`}
								message={`Vill du skicka statusuppdateringen ${this.state.statusText} till kund?`}
								disagree={'Nej'}
								agree={'Ja, skicka'}
								onChange={this.handleModal}
							/> : null
						}
					</div>
					<div className='ticket-overview__actions--assigned'>
						<p className='ticket-overview__actions__label'>Tilldelad:</p>
						<DropDownSelect
							selected={this.state.assignee}
							items={assignees}
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
	private handleStatusChange = (status: number, statusText: string): void => {
		this.setState({
			displayModal: true,
			status,
			statusText: statusText
		});
	}

	/**
	 * Handles assignee change for ticket
	 * @private
	 * @param {Number} selected - The selected index
	 */
	private handleAssigneeChange = (selected: number): void => {
		const { ticket, assignees, handleAssigneeChange } = this.props;
		const newAssignee = assignees[selected];

		ticket.assignee = newAssignee;
		this.props.handleAssigneeChange(ticket);
		this.setState({ assignee: newAssignee });
	}

	/**
	 * Handles status update message change
	 * @private
	 * @param {Boolean} doSend - If status change should be sent or not
	 */
	private handleModal = (doSend: boolean): void => {
		this.props.handleStatusChange(this.props.ticket, doSend);
		this.setState({ displayModal: false });
	}
}
