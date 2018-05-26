/**
 * AssigneeInput component
 * @module components/AssigneeInput/AssigneeInput
 */
import * as React from 'react';
import { Paper, Input } from 'material-ui';
import TextArea from 'react-textarea-autosize';

import Button from '../../elements/CustomButton/CustomButton';

/**
 * AssigneeInput Props Interface
 */
export interface IAssigneeInput {
	onClick(client: any): void;
	open: boolean;
	isEdit?: boolean;
	assignee?: any;
}

/**
 * AssigneeInput class
 */
export class AssigneeInput extends React.Component<IAssigneeInput, any> {

	constructor(props: any) {
		super(props);

		this.state = {
			assignee: {
				name: '',
				email: ''
			},
			validationFailed: false
		};
	}

	/**
	 * componentDidUpdate
	 * Updates current assignee in state
	 * @public
	 * @param {Object} prevProps - The previous props
	 */
	public componentDidUpdate(prevProps: any) {
		if (this.props !== prevProps && this.props.assignee) {
			const { assignee } = JSON.parse(JSON.stringify(this.props));
			this.setState({ assignee });
		}
	}

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const { open } = this.props;
		const { validationFailed } = this.state;
		const cssClasses = open ? 'assignee-list assignee-input' : 'assignee-list assignee-input assignee-input--hidden';

		return (
			<Paper className={cssClasses}>
				<form onSubmit={this.handleSubmit} className='assignee-input__field'>
					<Input
						placeholder='Namn'
						name='name'
						className={'assignee-input__input'}
						onChange={this.handleInput}
						value={this.state.assignee.name}
					/>
					<Input
						placeholder='E-post'
						name='email'
						className={'assignee-input__input'}
						inputProps={{
							type: 'email'
						}}
						onChange={this.handleInput}
						value={this.state.assignee.email}
					/>
					<Button theme={true} formBlock={true} type='submit'>
						{this.props.isEdit ?
							'Uppdatera' : 'Lägg till'
						}
					</Button>
				</form>
				{validationFailed && (
					<p className='assignee-input__error'>Alla fält måste fyllas i innan formuläret kan skickas.</p>
				)}
			</Paper>
		);
	}

	/**
	 * Handles button click to add the new client
	 * @private
	 */
	private handleSubmit = (event: any) => {
		event.preventDefault();

		if (this.state.assignee.name.length < 1 || this.state.assignee.email.length < 1) {
			this.setState({ validationFailed: true });
			return;
		}

		this.props.onClick(this.state.assignee);
		this.resetInput(event);
	}

	/**
	 * Handles input value
	 * @private
	 */
	private handleInput = (event: any) => {
		const { assignee } = this.state;
		assignee[event.target.name] = event.target.value;
		this.setState({ assignee });
	}

	/**
	 * Resets input fields after submit
	 * @private
	 */
	private resetInput(event: any) {
		const assignee = {
			name: '',
			email: ''
		};
		this.setState({ assignee, validationFailed: false });
	}
}
