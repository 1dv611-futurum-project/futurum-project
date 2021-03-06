/**
 * Modal component
 * @module components/Modal/Modal
 */
import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from 'material-ui';

/**
 * Modal Props Interface
 */
export interface IModal {
	title: string;
	message: string;
	agree: string;
	disagree?: string;
	onChange(agree: boolean): void;
}

/**
 * Modal class
 */
export class Modal extends React.Component<IModal, any> {

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const { title, message, agree, disagree } = this.props;

		return (
			<Dialog open={true} onClose={this.handleClose}>
				<DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
					<DialogContent>
						<DialogContentText id='alert-dialog-description'>
							{message}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						{ disagree ?
							<Button onClick={() => this.handleClose(false)} color='primary'>
								{disagree}
							</Button>
							: null
						}
						<Button onClick={() => this.handleClose(true)} color='primary' autoFocus={true}>
							{agree}
						</Button>
					</DialogActions>
			</Dialog>
		);
	}

	/**
	 * Handles closing of Modal
	 * @private
	 * @param {Any} agree - Whether or not to close the Modal
	 */
	private handleClose = (agree: any) => {
		typeof agree !== 'boolean' ? this.props.onChange(false) : this.props.onChange(agree);
	}
}
