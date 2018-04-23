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
	onChange(selected: number): void;
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
	 * componentDidUpdate - Update state to new props
	 * @public
	 * @param {any} prevProps
	 */
	public componentDidUpdate(prevProps: any) {
		if (prevProps !== this.props) {
			this.setState({
				selected: this.props.selected
			});
		}
	}

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const selected = this.getSelectedIndex(this.state.selected);
		const value = this.props.items[selected] || '';
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
	 * @param {any} event - The submitted event
	 */
	private handleChange(event: any) {
		const selected = this.getSelectedIndex(event.target.value);

		this.setState({ selected: selected });
		this.props.onChange(selected);
	}

	/**
	 * Get selected value index
	 * @private
	 * @param {string | number} value - The selected value
	 */
	private getSelectedIndex(value: string | number) {
		if (typeof value === 'string') {
			return this.props.items.indexOf(value);
		}
		return value;
	}
}
