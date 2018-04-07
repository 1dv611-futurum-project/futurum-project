/**
 * ClientList component
 * @module components/ClientList/ClientList
 */

import * as React from 'react';
import { ModeEdit, Delete } from 'material-ui-icons';
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
	IconButton
	} from 'material-ui';

/**
 * Ticket Props Interface
 */
export interface IClientRow {
	data: any;
	onEdit: any;
	onDelete: any;
}

/**
 * ClientList class
 */
export class ClientRow extends React.Component<IClientRow, any> {
	public render() {
		const client = this.props.data;

		return (
			<TableRow>
				<TableRowColumn className='client-list__table--row'>{client.name}</TableRowColumn>
				<TableRowColumn className='client-list__table--row'>{client.email}</TableRowColumn>
				<TableRowColumn className='client-list__table--row'>{client.errands}</TableRowColumn>
				<TableRowColumn className='client-list__table--icon'>
					<IconButton className='client-list__table--btn' tooltip='Redigera' onClick={this.props.onEdit}>
						<ModeEdit />
					</IconButton>
					<IconButton className='client-list__table--btn' tooltip='Ta bort' onClick={this.props.onDelete}>
						<Delete />
					</IconButton>
				</TableRowColumn>
			</TableRow>
		);
	}
}
