/**
 * AddButton component
 * @module components/AddButton/AddButton
 */

import * as React from 'react';
import { Button } from 'material-ui';
import { Add } from 'material-ui-icons';

/**
 * AddButton Props Interface
 */
export interface IAddButton {
	text: string;
	onClick(): any;
}

/**
 * AddButton class
 */
export class AddButton extends React.Component<IAddButton, any> {

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const { text, onClick } = this.props;

		return (
			<div className='add-btn'>
				<Button variant='fab' color='primary' aria-label='add' mini={true} onClick={onClick} className='add-btn__icon'>
					<Add />
				</Button>
				<p className='add-btn__text'>{text}</p>
			</div>
		);
	}
}
