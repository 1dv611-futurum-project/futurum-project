/**
 * ClientList component
 * @module components/ClientList/ClientList
 */

import * as React from 'react';
import { ModeEdit, Delete } from 'material-ui-icons';
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Tooltip } from 'material-ui';

/**
 * Ticket Props Interface
 */
export interface IClientList {
	data: any[];
	onEdit: any;
	onDelete: any;
}

/**
 * ClientList class
 */
export class ClientList extends React.Component<IClientList, any> {
	public render() {
		return (
			<Table className='client-list__table'>
			<TableHead>
				<TableRow>
					<TableCell className='client-list__table--header'>Företag</TableCell>
					<TableCell className='client-list__table--header'>Epost</TableCell>
					<TableCell className='client-list__table--header'>Ärenden</TableCell>
					<TableCell className='client-list__table--icon' />
				</TableRow>
			</TableHead>
			<TableBody>
				{this.props.data.map((client: any, i: any) => {
            	return (
              	<TableRow key={i}>
                	<TableCell>{client.name}</TableCell>
                	<TableCell>{client.email}</TableCell>
                	<TableCell>{client.errands}</TableCell>
					<TableCell className='client-list__table--icon'>
						<Tooltip title='Redigera'>
						<IconButton 
							className='client-list__table--btn' 
							onClick={() => this.props.onEdit(client.name)}>
							<ModeEdit />
						</IconButton>
						</Tooltip>
						<Tooltip title='Ta bort'>
						<IconButton 
							className='client-list__table--btn' 
							onClick={() => this.props.onDelete(client.name)}>
							<Delete />
						</IconButton>
						</Tooltip>
					</TableCell>
              	</TableRow>
            		);
				})}
			</TableBody>
			</Table>
		);
	}
}
