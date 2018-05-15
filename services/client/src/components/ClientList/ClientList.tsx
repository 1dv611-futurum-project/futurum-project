/**
 * ClientList component
 * @module components/ClientList/ClientList
 */

import * as React from 'react';
import { ModeEdit, Delete } from 'material-ui-icons';
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Tooltip } from 'material-ui';

import { ClientRow } from './ClientRow';

/**
 * ClientList Props Interface
 */
export interface IClientList {
	customers: any[];
	onEdit: any;
	onDelete: any;
}

/**
 * ClientList class
 */
export class ClientList extends React.Component<IClientList, any> {

	constructor(props: any) {
		super(props);
		this.state = {
			customers: []
		};
	}

	public componentDidMount() {
		const { customers } = this.props;
		this.setState({ customers });
	}

	public componentDidUpdate(prevProps: any) {
		if (prevProps !== this.props) {
			const { customers } = this.props;
			this.setState({ customers });
		}
	}

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const { onEdit, onDelete } = this.props;

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
			<TableBody className='client-list__table__body'>
				{ this.state.customers.map((client: any, i: any) => {
					return (
						<ClientRow
							key={i}
							customer={client}
							onEdit={onEdit}
							onDelete={onDelete}
						/>
					);
				}) }
			</TableBody>
			</Table>
		);
	}
}
