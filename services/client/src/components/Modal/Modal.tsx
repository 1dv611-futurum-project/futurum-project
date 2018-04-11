/**
 * Modal component
 * @module components/Modal/Modal
 */

import * as React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from 'material-ui';

/**
 * Modal Props Interface
 */
export interface IModal {
    title: string;
    message: string;
    disagree?: string;
    agree: string;
    onChange(agree: boolean): void;
}

/**
 * Modal class
 */
export class Modal extends React.Component<IModal, any> {
    public render() {
        const { title, message, agree, disagree } = this.props;

        return (
            <Dialog
                open={true}
                onClose={this.handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {disagree ?
                        <Button onClick={() => this.handleClose(false)} color="primary">
                            {disagree}
                        </Button> : null
                    }
                    <Button onClick={() => this.handleClose(true)} color='primary' autoFocus>
                        {agree}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    private handleClose = (agree: any) => {
        if (typeof agree !== 'boolean') {
            this.props.onChange(false);
        } else {
            this.props.onChange(agree);
        }
    }
}
