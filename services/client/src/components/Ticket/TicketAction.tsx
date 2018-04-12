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
	data: any;
	onStatusChange(status: number): void;
	onSend(message: string): void;
}

/**
 * TicketAction class
 */
export class TicketAction extends React.Component<ITicketAction, any> {

	constructor(props: any) {
		super(props);
		this.state = {
			displayModal: false,
			status: this.props.data.status,
		};

		this.handleStatusChange = this.handleStatusChange.bind(this);
		this.handleModal = this.handleModal.bind(this);
	}

	public render() {
		const ticket = this.props.data;

		return (
			<CardActions className='ticket__actions'>
				<StatusSelect status={this.state.status} onChange={this.handleStatusChange} />
					{this.state.displayModal ?
						<Modal
							title={`Uppdaterat status av "${ticket.title}"`}
							message={`Skicka statusuppdateringen ${this.state.statusText} till kund?`}
							disagree={'Avbryt'}
							agree={'Skicka'}
							onChange={this.handleModal}
						/> : null
					}
			</CardActions>
		);
	}

	/**
	 * Handles status change for ticket
	 * @private
	 */
	private handleStatusChange(status: number, statusText: string): void {
		this.props.onStatusChange(status);
		this.setState({
			displayModal: true,
			status: status,
			statusText: statusText,
		});
	}

	/**
	 * Handles status update message change
	 * @private
	 */
	private handleModal(doSend: boolean): void {
		if (doSend) {
			this.props.onSend(this.state.status);
		}
		this.closeModal();
	}

	/**
	 * Closes modal on status change
	 * @private
	 */
	private closeModal(): void {
		const state = { ...this.state };
		state.displayModal = false;
		this.setState(state);
	}
}
