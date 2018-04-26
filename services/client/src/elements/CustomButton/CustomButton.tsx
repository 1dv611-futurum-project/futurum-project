/**
 * CustomButton component
 * @module components/CustomButton/CustomButton
 */

import * as React from 'react';
import * as cx from 'classnames';
import { Button } from 'material-ui';

/**
 * CustomButton class
 */
class CustomButton extends React.Component<any, any> {

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const { round, formBlock, block, theme, ...rest } = this.props;
		const color = theme ? 'primary' : 'default';

		const btnClasses = cx({
			'add-btn__icon': round,
			'client-input__field__btn': formBlock,
			'message-input__footer__btn': block
		});

		return (
			<Button className={btnClasses} color={color} {...rest}/>
		);
	}
}

export default CustomButton;
