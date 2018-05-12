/**
 * AssigneeRow component
 * @module components/AssigneeList/AssigneeRow
 */
import * as React from 'react';
import { ModeEdit, Delete } from 'material-ui-icons';
import { TableRow, TableCell, IconButton, Tooltip } from 'material-ui';

/**
 * AssigneeRow Props Interface
 */
export interface IAssigneeRow {
	assignee: any;
	onEdit: any;
	onDelete: any;
}

/**
 * AssigneeRow class
 */
export class AssigneeRow extends React.Component<IAssigneeRow, any> {

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const { assignee, onEdit, onDelete } = this.props;
		const { name, email } = this.props.assignee;

		return (
			<TableRow>
				<TableCell>{name}</TableCell>
				<TableCell>{email}</TableCell>
				<TableCell className='assignee-list__table--icon'>
					<Tooltip title='Redigera'>
						<IconButton
							className='client-list__table--btn'
							onClick={() => onEdit(assignee)}
						>
							<ModeEdit />
						</IconButton>
					</Tooltip>
					<Tooltip title='Ta bort'>
						<IconButton
							className='assignee-list__table--btn'
							onClick={() => onDelete(assignee)}
						>
							<Delete />
						</IconButton>
					</Tooltip>
				</TableCell>
			</TableRow>
		);
	}
}
