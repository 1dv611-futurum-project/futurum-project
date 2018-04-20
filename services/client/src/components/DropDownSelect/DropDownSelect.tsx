/**
 * DropDownSelect component
 * @module components/DropDownSelect/DropDownSelect
 */

import * as React from 'react';
import { Select, MenuItem } from 'material-ui';

/**
 * DropDownSelect Props Interface
 */
export interface IDropDownSelect {
	selected: number;
	items: string[];
	onChange(event: any): void;
}

/**
 * DropDownSelect class
 */
export class DropDownSelect extends React.Component<IDropDownSelect, any> {

	constructor(props: any) {
		super(props);
		this.state = {
			selected: this.props.selected || 0
		};

		this.handleChange = this.handleChange.bind(this);
	}

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const value = this.props.items[this.state.selected];
		const items = this.props.items.map((item: any, i: number) => {
			return <MenuItem key={i} value={item} className='dropdown-select__item'>{item}</MenuItem>;
		});

		return (
			<Select
				value={value}
				onChange={this.handleChange}
				classes={{root: 'dropdown-select', icon: 'dropdown-select__icon'}}
			>
				{items}
			</Select>
		);
	}

	/**
	 * Handles change of selected value
	 * @private
	 */
	private handleChange(event: any) {
		this.setState({ selected: this.getSelectedIndex(event.target.value) });
		this.props.onChange(event.target.value);
	}

	/**
	 * Get selected value index
	 * @private
	 */
	private getSelectedIndex(value: string) {
		return this.props.items.indexOf(value);
	}
}
