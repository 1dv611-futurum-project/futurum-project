/**
 * AddButton component
 * @module components/AddButton/AddButton
 */

import * as React from 'react';
import { FloatingActionButton } from 'material-ui';
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
	public render() {
		const { text, onClick } = this.props;

		return (
			<div className='add-btn'>
				<FloatingActionButton onClick={onClick()} color='primary' aria-label='add' mini={true} className='add-btn__icon' >
					<Add />
				</FloatingActionButton>
				<p className='add-btn__text'>{text}</p>
			</div>
		);
	}
}
