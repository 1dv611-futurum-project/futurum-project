/**
 * ClientRow component
 * @module components/ClientRow/ClientRow
 */
import * as React from 'react';
import { ModeEdit, Delete } from 'material-ui-icons';
import { TableRow, TableCell, IconButton, Tooltip } from 'material-ui';

/**
 * ClientRow Props Interface
 */
export interface IClientRow {
	customer: any;
	onEdit: any;
	onDelete: any;
}

/**
 * ClientRow class
 */
export class ClientRow extends React.Component<IClientRow, any> {

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const { customer, onEdit, onDelete } = this.props;
		const { name, email, errands } = this.props.customer;

		return (
			<TableRow>
				<TableCell>{name}</TableCell>
				<TableCell>{email}</TableCell>
				<TableCell>{errands}</TableCell>
				<TableCell className='client-list__table--icon'>
					<Tooltip title='Redigera'>
						<IconButton
							className='client-list__table--btn'
							onClick={() => onEdit(customer)}
						>
							<ModeEdit />
						</IconButton>
					</Tooltip>
					<Tooltip title='Ta bort'>
						<IconButton
							className='client-list__table--btn'
							onClick={() => onDelete(customer)}
						>
							<Delete />
						</IconButton>
					</Tooltip>
				</TableCell>
			</TableRow>
		);
	}
}
