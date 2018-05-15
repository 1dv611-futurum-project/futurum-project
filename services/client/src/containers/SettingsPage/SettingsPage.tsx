/**
 * SettingsPage container
 * @module containers/SettingsPage/SettingsPage
 */
import * as React from 'react';
import { Divider } from 'material-ui';
import { AddButton } from '../../components/AddButton/AddButton';
// import { StatusColor } from '../../components/StatusColor/StatusColor';
import { AssigneeList } from '../../components/AssigneeList/AssigneeList';
import { AssigneeInput } from '../../components/AssigneeInput/AssigneeInput';

/**
 * Proof Of Concept
 * SettingsPage class
 */
export class SettingsPage extends React.Component<any, any> {

	constructor(props: any) {
		super(props);

		this.state = {
			showNewAssignee: false,
			isEdit: false,
			assignee: {
				name: '',
				email: ''
			}
		};
	}

	/**
	 * The render method
	 * @public
	 */
	public render() {
		return (
			<div className='settings__wrapper'>
				{/* Proof Of Concept: Edit status colors */}
				{/* <h1 className='settings__header__title'>Redigera statusfärger</h1>
				<StatusColor color={'red'} status={'Ej påbörjad'} onChange={this.onColorChange} />
				<StatusColor color={'blue'} status={'Påbörjad'} onChange={this.onColorChange} />
				<StatusColor color={'green'} status={'Genomförd'} onChange={this.onColorChange} />
				<StatusColor color={'green'} status={'Stängd'} onChange={this.onColorChange} />
				<br />
				<Divider /> */}

				<div className='assignee-list-page__header'>
					<h1 className='assignee-list-page__header__title'>Redigera ansvariga</h1>
					<div className='assignee-list-page__header__btn'>
						<AddButton
							text={'Lägg till ansvarig'}
							onClick={this.addHandler}
						/>
					</div>
				</div>
				<div className='ticket__wrapper__messages'>
					<AssigneeInput
							onClick={this.state.isEdit ? this.editAssignee : this.addAssignee}
							open={this.state.showNewAssignee}
							isEdit={this.state.isEdit}
							assignee={this.state.assignee}
					/>
				</div>
					<AssigneeList
						assignees={this.props.allAssignees}
						onEdit={this.editHandler}
						onDelete={this.deleteAssignee}
					/>
			</div>
		);
	}

	// Proof Of Concept: Change status color
	// /**
	//  * Handles color change
	//  * @private
	//  * @param {String} color - The new color
	//  */
	// private onColorChange(color: string) {
	// 	// TODO! Update with correct socket action
	// 	this.props.settingsAction.emitColor(color);
	// }

	/**
	 * Handles input box for add assignee
	 * @private
	 */
	private addHandler = ()  => {
		const showNewAssignee = !this.state.showNewAssignee;
		const isEdit = false;
		const assignee = { name: '', email: '' };
		this.setState({ showNewAssignee, isEdit, assignee });
	}

	/**
	 * Handles input box for edit assignee
	 * @private
	 * @param {Object} assignee - The existing assignee data
	 */
	private editHandler = (assignee: any) => {
		const showNewAssignee = !this.state.showNewAssignee;
		const isEdit = true;
		this.setState({ showNewAssignee, isEdit, assignee });
	}

	/**
	 * Adds a new assignee
	 * @private
	 * @param {Object} assignee - The new assignee
	 */
	private addAssignee = (assignee: any) => {
		this.setState({ showNewAssignee: false });
		this.props.assigneeAction.emitAddAssignee(assignee);
	}

	/**
	 * Edits an existing assignee
	 * @private
	 * @param {Object} assignee - The existing assignee data
	 */
	private editAssignee = (assignee: any) => {
		this.setState({ showNewAssignee: false });
		this.props.assigneeAction.emitEditAssignee(assignee);
	}

	/**
	 * Deletes an existing assignee
	 * @private
	 * @param {Object} assignee - The existing assignee data
	 */
	private deleteAssignee = (assignee: any) => {
		this.props.assigneeAction.emitDeleteAssignee(assignee);
	}
}
