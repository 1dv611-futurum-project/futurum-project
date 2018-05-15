/**
 * SnackbarNotice component
 * @module components/SnackbarNotice/SnackbarNotice
 */
import * as React from 'react';
import { Snackbar, IconButton } from 'material-ui';
import { Error, Close } from 'material-ui-icons';

/**
 * SnackbarNotice Props Interface
 */
export interface ISnackbarNotice {
	message: string;
	open: boolean;
	onClose(event: any): void;
	error?: boolean;
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
		const { message, onClose, open, error } = this.props;
		const text = <span id='snackbar__message'>{error ? <Error color='error'/> : null}{message}</span>;

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
				message={text}
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
