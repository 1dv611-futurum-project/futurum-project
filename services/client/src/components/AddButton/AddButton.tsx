/**
 * AddButton component
 * @module components/AddButton/AddButton
 */
import * as React from 'react';
import { Add } from 'material-ui-icons';
import Button from '../../elements/CustomButton/CustomButton';

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
				<Button variant='fab' theme={true} round={true} mini={true} onClick={onClick}>
					<Add />
				</Button>
				<p className='add-btn__text'>{text}</p>
			</div>
		);
	}
}
