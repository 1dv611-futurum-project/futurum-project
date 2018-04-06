/**
 * ClientListPage container
 * @module containers/ClientListPage/ClientListPage
 */

import * as React from 'react';
import { AddButton } from '../../components/AddButton/AddButton';
import { ClientList } from '../../components/ClientList/ClientList';

/**
 * ClientListPage class
 */
export class ClientListPage extends React.Component<any, any> {

	public render() {
		return (
			<div className='clients-list__wrapper'>
				<AddButton text={'Lägg till kund'} onClick={this.addClient}/>
				<ClientList />
			</div>
		);
	}

	private addClient() {
		console.log('La till användare');
	}
}
