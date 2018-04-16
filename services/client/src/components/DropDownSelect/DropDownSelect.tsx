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
	selected: string;
	items: any;
	onChange(event: any): void;
}

/**
 * DropDownSelect class
 */
export class DropDownSelect extends React.Component<IDropDownSelect, any> {

	constructor(props: any) {
		super(props);
		this.state = {
			selected: this.props.selected
		};

		this.handleChange = this.handleChange.bind(this);
	}

	public render() {
		const items = this.getMenuItems();

		return (
			<Select
				value={this.state.selected}
				onChange={this.handleChange}
				classes={{root: 'dropdown-select', icon: 'dropdown-select__icon'}}
			>
				{items}
			</Select>
		);
	}

	/**
	 * Gets the menu items for the select
	 * @returns {Array} - The menu items
	 */
	private getMenuItems() {
		const { items } = this.props;

		return items.map((item: any, i: number) => {
			return <MenuItem key={i} value={item} className='dropdown-select__item'>{item}</MenuItem>;
		});
	}

	/**
	 * Handles change of selected value
	 * @private
	 */
	private handleChange(event: any) {
		this.setState({ selected: event.target.value });
		this.props.onChange(event.target.value);
	}
}
