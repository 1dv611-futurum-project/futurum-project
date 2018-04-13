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
			message: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	public render() {
		const { open } = this.props;
		const cssClasses = open ? 'client-list client-input' : 'client-list client-input client-input--hidden';

		return (
			<Paper className={cssClasses}>
				<div className='client-input__field'>
					<Input
						placeholder='Företag'
						className={'client-input__input'}
					/>
					<Input
						placeholder='Epost'
						className={'client-input__input'}
						inputProps={{
							type: 'email',
						}}
					/>
					<Button variant='raised' size='small' className='client-input__field__btn' onClick={this.handleClick}>
						Lägg till
					</Button>
				</div>
			</Paper>
		);
	}

	/**
	 * Handles change in textarea
	 * @private
	 */
	private handleChange(e: any) {
		this.setState({ message: e.target.value});
	}

	/**
	 * Handles button click to send the new message
	 * @private
	 */
	private handleClick() {
		this.props.onClick(this.state.message);
	}
}
