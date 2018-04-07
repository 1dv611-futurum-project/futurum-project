/**
 * StatusSelect component
 * @module components/StatusSelect/StatusSelect
 */

import * as React from 'react';
import { Select, MenuItem } from 'material-ui';

/**
 * StatusSelect Props Interface
 */
export interface IStatusSelect {
	status: string;
	onChange(status: string): void;
}

/**
 * StatusSelect class
 */
export class StatusSelect extends React.Component<IStatusSelect, any> {

	constructor(props: any) {
		super(props);
		this.state = {
			selected: this.props.status || 'Ej påbörjad'
		};

		this.handleChange = this.handleChange.bind(this);
	}

	public render() {
		return (
			<Select
				value={this.state.selected}
				onChange={this.handleChange}
				classes={{root: 'status-select', icon: 'status-select__icon'}}
			>
				<MenuItem value='Ej påbörjad' className='status-select__item'>Ej påbörjad</MenuItem>
				<MenuItem value='Påbörjad' className='status-select__item'>Påbörjad</MenuItem>
				<MenuItem value='Genomförd' className='status-select__item'>Genomförd</MenuItem>
				<MenuItem value='Stängd' className='status-select__item'>Stängd</MenuItem>
			</Select>
		);
	}

	/**
	 * Handles change when a new status is selected
	 * @private
	 */
	private handleChange(event: any): void {
		this.setState({ selected: event.target.value });
		this.props.onChange(event.target.value);
	}
}
