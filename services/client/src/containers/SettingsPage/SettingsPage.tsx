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
import { SnackbarNotice } from '../../components/SnackbarNotice/SnackbarNotice';

/**
 * Proof Of Concept
 * SettingsPage class
 */
export class SettingsPage extends React.Component<any, any> {

	constructor(props: any) {
		super(props);
		this.state = {
			showNewAssignee: false,
			snackMessage: '',
			snackState: false
		};
		this.addHandler = this.addHandler.bind(this);
		this.editHandler = this.editHandler.bind(this);

		this.addAssignee = this.addAssignee.bind(this);
		this.editAssignee = this.editAssignee.bind(this);
		this.deleteAssignee = this.deleteAssignee.bind(this);
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
					<SnackbarNotice
						message={this.state.snackMessage}
						open={this.state.snackState}
						onClose={() => this.setState({ snackState: false })}
					/>

				{/* <h1 className='settings__header__title'>Redigera ansvariga</h1>
				<AddButton text='Lägg till ansvariga' onClick={() => { return; }}/> */}
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
	 * Handles input box for add client
	 * @private
	 */
	private addHandler() {
		const showNewAssignee = !this.state.showNewAssignee;
		const isEdit = false;
		const assignee = { name: '', email: '' };
		this.setState({ showNewAssignee, isEdit, assignee });
	}

	/**
	 * Handles input box for edit client
	 * @private
	 * @param {Object} client - The existing client data
	 */
	private editHandler(assignee: any) {
		const showNewAssignee = !this.state.showNewAssignee;
		const isEdit = true;
		this.setState({ showNewAssignee, isEdit, assignee });
	}

	/**
	 * Adds a new assignee
	 * @private
	 * @param {Object} assignee - The new assignee
	 */
	private addAssignee(assignee: any) {
		this.setState({
			showNewAssignee: false,
			snackState: true,
			snackMessage: 'Den nya ansvarige har lagts till i listan.'
		});

		this.props.allAssignees.push(assignee);
		this.props.assigneeAction.emitAddAssignee(assignee);
	}

	private editAssignee(assignee: any) {
		this.setState({
			showNewAssignee: false,
			snackState: true,
			snackMessage: 'Den ansvariges uppgifter har uppdaterats.'
		});

		this.props.assigneeAction.emitEditAssignee(assignee);
	}

	private deleteAssignee(assignee: any) {
		const index = this.props.allAssignees.indexOf(assignee);

		this.props.allAssignees.splice(index, 1);
		this.setState({
			snackState: true,
			snackMessage: 'Ansvarig har tagits bort från listan.'
		});

		this.props.assigneeAction.emitDeleteAssignee(assignee);
	}
}
