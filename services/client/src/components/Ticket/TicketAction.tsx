/**
 * Ticket component
 * @module components/Ticket/TicketAction
 */
import * as React from 'react';
import { CardActions } from 'material-ui';
import { StatusSelect } from '../StatusSelect/StatusSelect';
import { Modal } from '../Modal/Modal';

/**
 * TicketAction Props Interface
 */
export interface ITicketAction {
	ticket: any;
	onStatusChange(status: number): void;
	onSend(message: string, mailCustomer: boolean): void;
}

/**
 * TicketAction class
 */
export class TicketAction extends React.Component<ITicketAction, any> {

	constructor(props: any) {
		super(props);
		this.state = {
			displayModal: false,
			status: this.props.ticket.status,
			statusText: ''
		};
	}

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const { ticket } = this.props;

		return (
			<CardActions className='ticket__actions'>
				<StatusSelect selected={this.state.status} onChange={this.handleStatusChange} />
					{ this.state.displayModal ?
						<Modal
							title={`Uppdatering av status för ärendet "${ticket.title}"`}
							message={`Vill du skicka statusuppdateringen ${this.state.statusText} till kund?`}
							disagree={'Nej'}
							agree={'Ja, skicka'}
							onChange={this.handleModal}
						/> : null
					}
			</CardActions>
		);
	}

	/**
	 * Handles status change for ticket
	 * @private
	 * @param {Number} status - The status number (0-3)
	 * @param {String} statusText - The status in text
	 */
	private handleStatusChange = (status: number, statusText: string): void => {
		this.props.onStatusChange(status);
		this.setState({
			displayModal: true,
			status,
			statusText
		});
	}

	/**
	 * Handles status update message change
	 * @private
	 * @param {Boolean} doSend - If status change should be sent or not
	 */
	private handleModal = (doSend: boolean): void => {
		this.props.onSend(this.props.ticket, doSend);
		this.setState({ displayModal: false });
	}
}
