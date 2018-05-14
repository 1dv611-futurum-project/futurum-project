/**
 * ClientListPage container
 * @module containers/ClientListPage/ClientListPage
 */
import * as React from 'react';
import { AddButton } from '../../components/AddButton/AddButton';
import { ClientList } from '../../components/ClientList/ClientList';
import { ClientInput } from '../../components/ClientInput/ClientInput';

/**
 * ClientListPage class
 */
export class ClientListPage extends React.Component<any, any> {

	constructor(props: any) {
		super(props);
		this.state = {
			showNewClient: false,
		};
		this.addHandler = this.addHandler.bind(this);
		this.editHandler = this.editHandler.bind(this);

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
						<AddButton
							text={'Lägg till kund'}
							onClick={this.addHandler}
						/>
					</div>
				</div>
				<div className='ticket__wrapper__messages'>
					<ClientInput
						onClick={this.state.isEdit ? this.editClient : this.addClient}
						open={this.state.showNewClient}
						isEdit={this.state.isEdit}
						client={this.state.client}
					/>
				</div>
				<ClientList
					customers={this.props.allCustomers}
					onEdit={this.editHandler}
					onDelete={this.deleteClient}
				/>
			</div>
		);
	}

	/**
	 * Handles input box for add client
	 * @private
	 */
	private addHandler() {
		const showNewClient = !this.state.showNewClient;
		const isEdit = false;
		const client = { name: '', email: '' };
		this.setState({ showNewClient, isEdit, client });
	}

	/**
	 * Handles input box for edit client
	 * @private
	 * @param {Object} client - The existing client data
	 */
	private editHandler(client: any) {
		const showNewClient = !this.state.showNewClient;
		const isEdit = true;
		this.setState({ showNewClient, isEdit, client });
	}

	/**
	 * Adds a new client
	 * @private
	 * @param {Object} client - The new client
	 */
	private addClient(client: any) {
		this.setState({ showNewClient: false });
		this.props.customerAction.emitAddCustomer(client);
	}

	/**
	 * Edits an existing client
	 * @private
	 * @param {Object} client - The existing client data
	 */
	private editClient(client: any) {
		this.setState({ showNewClient: false });
		this.props.customerAction.emitEditCustomer(client);
	}

	/**
	 * Deletes an existing client
	 * @private
	 * @param {Object} client - The existing client data
	 */
	private deleteClient(client: any) {
		this.props.customerAction.emitDeleteCustomer(client);
	}
}
