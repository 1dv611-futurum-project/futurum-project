/**
 * ClientInput component
 * @module components/ClientInput/ClientInput
 */
import * as React from 'react';
import { Paper, Input } from 'material-ui';
import TextArea from 'react-textarea-autosize';

import Button from '../../elements/CustomButton/CustomButton';

/**
 * ClientInput Props Interface
 */
export interface IClientInput {
	onClick(client: any): void;
	open: boolean;
	isEdit?: boolean;
	client?: any;
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

	public componentDidUpdate(prevProps: any) {
		if (this.props !== prevProps && this.props.client) {
			const { client } = this.props;
			this.setState({ client });
		}
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
						value={this.state.client.name}
					/>
					<Input
						placeholder='E-post'
						name='email'
						className={'client-input__input'}
						inputProps={{
							type: 'email'
						}}
						onChange={this.handleInput}
						value={this.state.client.email}
					/>
					<Button theme={true} formBlock={true} type='submit'>
						{this.props.isEdit ?
							'Uppdatera' : 'Lägg till'
						}
					</Button>
				</form>
			</Paper>
		);
	}

	/**
	 * Handles button click to add the new client
	 * @private
	 */
	private handleSubmit = (event: any) => {
		event.preventDefault();
		this.props.onClick(this.state.client);
		this.resetInput(event);
	}

	/**
	 * Handles input value
	 * @private
	 */
	private handleInput = (event: any) => {
		const { client } = this.state;
		client[event.target.name] = event.target.value;
		this.setState({ client });
	}

	private resetInput(event: any) {
		const client = {
			name: '',
			email: ''
		};
		this.setState({ client });
	}
}
