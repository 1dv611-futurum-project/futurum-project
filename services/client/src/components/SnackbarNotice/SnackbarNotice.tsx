/**
 * SnackbarNotice component
 * @module components/SnackbarNotice/SnackbarNotice
 */
import * as React from 'react';
import { Snackbar, IconButton } from 'material-ui';
import { Close } from 'material-ui-icons';

/**
 * SnackbarNotice Props Interface
 */
export interface ISnackbarNotice {
	message: string;
	open: boolean;
	onClose(event: any): void;
}

/**
 * SnackbarNotice class
 */
export class SnackbarNotice extends React.Component<ISnackbarNotice, any> {

	constructor(props: any) {
		super(props);

		this.state = {
			open: this.props.open || false
		};
	}

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const { message, onClose, open } = this.props;

		return (
			<Snackbar
				className='snackbar'
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left'
				}}
				open={open}
				autoHideDuration={6000}
				onClose={onClose}
				message={<span id='snackbar__message'>{message}</span>}
				action={[
					<IconButton
						key='close'
						aria-label='Stäng'
						color='inherit'
						onClick={onClose}
					>
						<Close />
					</IconButton>,
				]}
			/>
		);
	}
}
