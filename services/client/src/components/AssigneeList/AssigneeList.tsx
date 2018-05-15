/**
 * AssigneeList component
 * @module components/AssigneeList/AssigneeList
 */

import * as React from 'react';
import { ModeEdit, Delete } from 'material-ui-icons';
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Tooltip } from 'material-ui';

import { AssigneeRow } from './AssigneeRow';

/**
 * AssigneeList Props Interface
 */
export interface IAssigneeList {
	assignees: any[];
	onEdit: any;
	onDelete: any;
}

/**
 * AssigneeList class
 */
export class AssigneeList extends React.Component<IAssigneeList, any> {

	constructor(props: any) {
		super(props);
		this.state = {
			assignees: []
		};
	}

	public componentDidMount() {
		const { assignees } = this.props;
		this.setState({ assignees });
	}

	public componentDidUpdate(prevProps: any) {
		if (prevProps !== this.props) {
			const { assignees } = this.props;
			this.setState({ assignees });
		}
	}

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const { onEdit, onDelete } = this.props;

		return (
			<Table className='assignee-list__table'>
			<TableHead>
				<TableRow>
					<TableCell className='assignee-list__table--header'>Namn</TableCell>
					<TableCell className='assignee-list__table--header'>Epost</TableCell>
					<TableCell className='assignee-list__table--icon' />
				</TableRow>
			</TableHead>
			<TableBody className='assignee-list__table__body'>
				{ this.state.assignees.map((assignee: any, i: any) => {
					return (
						<AssigneeRow
							key={i}
							assignee={assignee}
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
