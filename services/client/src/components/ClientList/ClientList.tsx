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

import { ClientRow } from './ClientRow';
import { clientListStyle } from '../../variables/Variables';

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
		const rows = this.props.data.map((client: any, i: any) =>
			<ClientRow 
				key={i} 
				data={client} 
				onEdit={() => this.props.onEdit(client.name)} 
				onDelete={() => this.props.onDelete(client.name)}
			/>);

		return (
			<Table
				wrapperStyle={clientListStyle.wrapper}
				bodyStyle={clientListStyle.body}
			>
			<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
				<TableRow>
					<TableHeaderColumn className='client-list__table--header'>Företag</TableHeaderColumn>
					<TableHeaderColumn className='client-list__table--header'>Epost</TableHeaderColumn>
					<TableHeaderColumn className='client-list__table--header'>Ärenden</TableHeaderColumn>
					<TableHeaderColumn className='client-list__table--icon' />
				</TableRow>
			</TableHeader>
			<TableBody displayRowCheckbox={false}>
				{rows}
			</TableBody>
			</Table>
		);
	}
}
