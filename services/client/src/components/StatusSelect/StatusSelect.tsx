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
	status: number;
	onChange(status: number, statusText?: string): void;
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

	public componentDidMount() {
		let status = this.getStatusText(this.props.status);
		this.setState({ selected: status });
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
	 * Gets the correct status message from number
	 * @private
	 * @param {Number} status - The status number (0-3)
	 * @returns {String} - The status as a string
	 */
	private getStatusText(status: number): string {
		switch (status) {
			case 0:
				return 'Ej påbörjad';
			case 1:
				return 'Påbörjad';
			case 2:
				return 'Genomförd';
			case 3:
				return 'Stängd';
		}
	}

		/**
	 * Gets the correct status message from number
	 * @private
	 * @param {Number} status - The status number (0-3)
	 * @returns {String} - The status as a string
	 */
	private getStatus(status: string): number {
		switch (status) {
			case 'Ej påbörjad':
				return 0;
			case 'Påbörjad':
				return 1;
			case 'Genomförd':
				return 2;
			case 'Stängd':
				return 3;
		}
	}

	/**
	 * Handles change when a new status is selected
	 * @private
	 */
	private handleChange(event: any): void {
		let status = this.getStatus(event.target.value);
		this.setState({ selected: event.target.value });
		this.props.onChange(status, event.target.value);
	}
}
