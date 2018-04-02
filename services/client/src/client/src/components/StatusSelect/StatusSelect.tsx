/**
 * StatusSelect component
 * @module components/StatusSelect/StatusSelect
 */

import * as React from 'react';
import { SelectField, MenuItem } from 'material-ui';

import { menuStyle } from '../../variables/Variables';

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
			<SelectField
				value={this.state.selected}
				onChange={this.handleChange}
				style={menuStyle.menu}
				menuItemStyle={menuStyle.menuItem}
				iconStyle={menuStyle.icon}
				labelStyle={menuStyle.label}
			>
				<MenuItem value='Ej påbörjad' primaryText='Ej påbörjad' />
				<MenuItem value='Påbörjad' primaryText='Påbörjad' />
				<MenuItem value='Genomförd' primaryText='Genomförd' />
				<MenuItem value='Stängd' primaryText='Stängd' />
			</SelectField>
		);
	}

	/**
	 * Handles change when a new status is selected
	 * @private
	 */
	private handleChange(event: any, index: number, value: string): void {
		this.setState({ selected: value });
		this.props.onChange(value);
	}
}
