/**
 * ClientInput component
 * @module components/ClientInput/ClientInput
 */

import * as React from 'react';
import { Paper, Button, Input } from 'material-ui';
import TextArea from 'react-textarea-autosize';

/**
 * ClientInput Props Interface
 */
export interface IClientInput {
	onClick(message: string): any;
	open: boolean;
}

/**
 * MessageInput class
 */
export class ClientInput extends React.Component<IClientInput, any> {

	constructor(props: any) {
		super(props);

		this.state = {
			client: {
				name: '',
				email: ''
			}
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const { open } = this.props;
		const cssClasses = open ? 'client-list client-input' : 'client-list client-input client-input--hidden';

		return (
			<Paper className={cssClasses}>
				<form onSubmit={this.handleSubmit} className='client-input__field'>
					<Input
						placeholder='Företag'
						name='name'
						className={'client-input__input'}
						onChange={this.handleInput}
					/>
					<Input
						placeholder='Epost'
						name='email'
						className={'client-input__input'}
						inputProps={{
							type: 'email',
						}}
						onChange={this.handleInput}
					/>
					<Button variant='raised' type='submit' size='small' className='client-input__field__btn'>
						Lägg till
					</Button>
				</form>
			</Paper>
		);
	}

	/**
	 * Handles button click to add the new client
	 * @private
	 */
	private handleSubmit(event: any) {
		event.preventDefault();
		this.props.onClick(this.state.client);
	}

	/**
	 * Handles input value
	 * @private
	 */
	private handleInput(event: any) {
		this.state.client[event.target.name] = event.target.value;
	}
}
