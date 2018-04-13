/**
 * ClientListPage container
 * @module containers/ClientListPage/ClientListPage
 */

import * as React from 'react';
import { AddButton } from '../../components/AddButton/AddButton';
import { ClientList } from '../../components/ClientList/ClientList';
import { ClientInput } from '../../components/ClientInput/ClientInput';

const clients = [
	{
		name: 'Företaget AB',
		email: 'foretaget@foretaget.com',
		errands: 2
	},
	{
		name: 'Microsoft Inc',
		email: 'microsoft@support.com',
		errands: 5
	}
];

/**
 * ClientListPage class
 */
export class ClientListPage extends React.Component<any, any> {

	constructor(props: any) {
		super(props);
		this.state = {
			showNewClient: false,
		};

		this.handleAddClientClick = this.handleAddClientClick.bind(this);
		this.addClient = this.addClient.bind(this);
	}

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
					data={clients}
					onEdit={this.editClient}
					onDelete={this.deleteClient}
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

	private addClient(client: any) {
		console.log('La till användare');
	}

	private editClient(client: any) {
		console.log('Redigera ' + client);
	}

	private deleteClient(client: any) {
		console.log('Ta bort ' + client);
	}
}
