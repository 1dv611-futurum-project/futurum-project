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

	/**
	 * The render method
	 * @public
	 */
	public render() {
		return (
			<div className='settings__wrapper'>
				<h1 className='client-list-page__header__title'>Redigera statusfärger</h1>
				<StatusColor color={'red'} status={'Ej påbörjad'} onChange={this.onColorChange} />
				<StatusColor color={'blue'} status={'Påbörjad'} onChange={this.onColorChange} />
				<StatusColor color={'green'} status={'Genomförd'} onChange={this.onColorChange} />
				<StatusColor color={'green'} status={'Stängd'} onChange={this.onColorChange} />
				<br />
				<Divider />
				<h1 className='client-list-page__header__title'>Redigera ansvariga</h1>
				<AddButton text='Lägg till ansvariga' onClick={() => { return; }}/>
			</div>
		);
	}

	/**
	 * Handles color change
	 * @private
	 * @param {String} color - The new color
	 */
	private onColorChange(color: string) {
		// TODO! Update with correct socket action
		this.props.settingsAction.emitColor(color);
	}

	private addAssignee(color: string) {
		// TODO: Add assignee
	}

	private editAssignee(color: string) {
		// TODO: Edit assignee
	}

	private deleteAssignee(color: string) {
		// TODO: Edit assignee
	}
}
