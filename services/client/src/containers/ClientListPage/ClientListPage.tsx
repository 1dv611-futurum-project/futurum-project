/**
 * ClientListPage container
 * @module containers/ClientListPage/ClientListPage
 */

import * as React from 'react';
import { AddButton } from '../../components/AddButton/AddButton';
// import { ClientList } from '../../components/ClientList/ClientList';

/**
 * ClientListPage class
 */
export class ClientListPage extends React.Component<any, any> {

	constructor(props: any) {
		super(props);
		this.state = {
			clients: [],
		};
	}

	public componentDidMount() {
		const clients: any[] = [];
		const client1 = {
			name: 'Företaget AB',
			email: 'foretaget@foretaget.com',
			errands: 2
		};
		const client2 = {
			name: 'Microsoft Inc',
			email: 'microsoft@support.com',
			errands: 5
		};

		clients.push(client1, client2);
		this.setState({ clients: clients});
	}

	public render() {
		return (
			<div className='client-list-page__wrapper'>
				<div className='client-list-page__header'>
					<h1 className='client-list-page__header__title'>Kundlista</h1>
					<div className='client-list-page__header__btn'>
						<AddButton text={'Lägg till kund'} onClick={this.addClient}/>
					</div>
				</div>
				{/*<ClientList data={this.state.clients}/>*/}
			</div>
		);
	}

	private addClient() {
		console.log('La till användare');
	}
}
