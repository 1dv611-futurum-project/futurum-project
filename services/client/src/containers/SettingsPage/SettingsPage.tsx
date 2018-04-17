/**
 * SettingsPage container
 * @module containers/SettingsPage/SettingsPage
 */

import * as React from 'react';
import { Divider } from 'material-ui';
import { StatusColor } from '../../components/StatusColor/StatusColor';
import { AddButton } from '../../components/AddButton/AddButton';

/**
 * Proof Of Concept
 * SettingsPage class
 */
export class SettingsPage extends React.Component<any, any> {

	public render() {
		return (
			<div className='settings__wrapper'>
				<h1 className='client-list-page__header__title'>Redigera statusfärger</h1>
				<StatusColor color={'red'} status={'Ej påbörjad'} onChange={this.onChange} />
				<StatusColor color={'blue'} status={'Påbörjad'} onChange={this.onChange} />
				<StatusColor color={'green'} status={'Genomförd'} onChange={this.onChange} />
				<StatusColor color={'green'} status={'Stängd'} onChange={this.onChange} />
				<br />
				<Divider />
				<h1 className='client-list-page__header__title'>Redigera ansvariga</h1>
				<AddButton text='Lägg till ansvariga' onClick={() => {return; }}/>
			</div>
		);
	}

	private onChange(color: string) {
		console.log(color);
	}
}
