/**
 * ClientListPage container
 * @module containers/ClientListPage/ClientListPage
 */

import * as React from 'react';
import { AddButton } from '../../components/AddButton/AddButton';
import { ClientList } from '../../components/ClientList/ClientList';
import { ClientInput } from '../../components/ClientInput/ClientInput';
import { SnackbarNotice } from '../../components/SnackbarNotice/SnackbarNotice';

/**
 * ClientListPage class
 */
export class ClientListPage extends React.Component<any, any> {

	constructor(props: any) {
		super(props);
		this.state = {
			showNewClient: false,
			snackMessage: '',
			snackState: false
		};

		this.handleAddClientClick = this.handleAddClientClick.bind(this);
		this.addClient = this.addClient.bind(this);
		this.editClient = this.editClient.bind(this);
		this.deleteClient = this.deleteClient.bind(this);
	}

	/**
	 * The render method
	 * @public
	 */
	public render() {
		return (
			<div className='client-list-page__wrapper'>
				<div className='client-list-page__header'>
					<h1 className='client-list-page__header__title'>Kundlista</h1>
					<div className='client-list-page__header__btn'>
						<AddButton text={'Lägg till kund'} onClick={this.handleAddClientClick}/>
					</div>
				</div>
				<div className='ticket__wrapper__messages'>
					<ClientInput onClick={this.addClient} open={this.state.showNewClient} />
				</div>
				<ClientList
					customers={this.props.allCustomers}
					onEdit={this.editClient}
					onDelete={this.deleteClient}
				/>
				<SnackbarNotice
					message={this.state.snackMessage}
					open={this.state.snackState}
					onClose={this.handleSnackbarClose}
				/>
			</div>
		);
	}

	/**
	 * Handles click on add client button
	 * @private
	 */
	private handleAddClientClick() {
		this.setState({ showNewClient: true });
	}

	/**
	 * Adds a new client
	 * @private
	 * @param {Object} client - The new client
	 */
	private addClient(client: any) {
		this.setState({
			showNewClient: false,
			snackState: true,
			snackMessage: 'Den nya kunden har lagts till i listan.'
		});

		this.props.allCustomers.push(client);
		this.props.customerAction.emitAddCustomer(client);
	}

	/**
	 * Edits an existing client
	 * @private
	 * @param {Object} client - The existing client data
	 */
	private editClient(client: any) {
		this.setState({
			snackState: true,
			snackMessage: 'Kundens uppgifter har uppdaterats.'
		});

		this.props.customerAction.emitEditCustomer(client);
	}

	/**
	 * Deletes an existing client
	 * @private
	 * @param {Object} client - The existing client data
	 */
	private deleteClient(client: any) {
		const index = this.props.allCustomers.indexOf(client);

		this.props.allCustomers.splice(index, 1);
		this.setState({
			snackState: true,
			snackMessage: 'Kunden har tagits bort från kundlistan.'
		});

		this.props.customerAction.emitDeleteCustomer(client);
	}

	/**
	 * Handles manual close of SnackbarNotice
	 * @private
	 */
	private handleSnackbarClose = (event: any) => {
		this.setState({ snackState: false });
	}
}
