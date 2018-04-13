/**
 * StatusSelect component
 * @module components/StatusSelect/StatusSelect
 */

import * as React from 'react';
import { Select, MenuItem } from 'material-ui';
import { DropDownSelect } from '../DropDownSelect/DropDownSelect';

/**
 * StatusSelect Props Interface
 */
export interface IStatusSelect {
	selected: number;
	onChange(selected: any, statusText: string): void;
}

/**
 * StatusSelect class
 */
export class StatusSelect extends React.Component<IStatusSelect, any> {

	constructor(props: any) {
		super(props);
		this.state = {
			statuses: ['Ej påbörjad', 'Påbörjad', 'Genomförd', 'Stängd'],
			selected: this.props.selected
		};

		this.handleChange = this.handleChange.bind(this);
	}

	public render() {
		const status = this.getStatusText(this.props.selected);

		return (
			<span className='select'>
				<DropDownSelect
					selected={status}
					items={this.state.statuses}
					onChange={this.handleChange}
				/>
			</span>
		);
	}

	/**
	 * Gets the correct status message from number
	 * @private
	 * @param {Number} statusNumber - The status number (0-3)
	 * @returns {String} - The status as a string
	 */
	private getStatusText(statusNumber: number): string {
		return this.state.statuses[statusNumber];
	}

	/**
	 * Gets the correct status number from message
	 * @private
	 * @param {string} statusText - The status in text
	 * @returns {Number} - The status as a number
	 */
	private getStatusNumber(statusText: string): number {
		return this.state.statuses.indexOf(statusText);
	}

	/**
	 * Handles change when a new status is selected
	 * @private
	 */
	private handleChange(selected: string): void {
		const statusNumber = this.getStatusNumber(selected);
		this.setState({ selected });
		this.props.onChange(statusNumber, selected);
	}
}
