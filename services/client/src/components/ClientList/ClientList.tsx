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
 * ClientList class
 */
export class ClientList extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			selected: [1],
		};
	}

	public render() {
		const otherstyle       = { width: '30%'};
		const gunnarStyle       = { width: '10%'};

		return (
			<Table onRowSelection={this.handleRowSelection}>
			<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
				<TableRow>
					<TableHeaderColumn className='clientlist__table--header'>Företag</TableHeaderColumn>
					<TableHeaderColumn className='clientlist__table--header'>Epost</TableHeaderColumn>
					<TableHeaderColumn className='clientlist__table--header'>Ärenden</TableHeaderColumn>
					<TableHeaderColumn className='clientlist__table--icon' />
				</TableRow>
			</TableHeader>
			<TableBody displayRowCheckbox={false}>
				<TableRow selected={this.isSelected(0)}>
					<TableRowColumn className='clientlist__table--row'>Företaget AB</TableRowColumn>
					<TableRowColumn className='clientlist__table--row'>foretaget@foretaget.com</TableRowColumn>
					<TableRowColumn className='clientlist__table--row'>2</TableRowColumn>
					<TableRowColumn className='clientlist__table--icon'>
						<IconButton className='clientlist__table--btn'>
							<ModeEdit />
						</IconButton>
						<IconButton className='clientlist__table--btn'>
							<Delete />
						</IconButton>
					</TableRowColumn>
				</TableRow>
			</TableBody>
			</Table>
		);
	}

	private isSelected = (index: number) => {
		return this.state.selected.indexOf(index) !== -1;
	}

	private handleRowSelection = (selectedRows: any) => {
		this.setState({
			selected: selectedRows,
		});
	}

}
