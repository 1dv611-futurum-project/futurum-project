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
	}

	/**
	 * componentDidUpdate
	 * Update state to new props
	 * @public
	 * @param {Object} prevProps - The previous props
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
		const value = this.props.items[selected] || '--';
		const items = this.props.items.map(this.getMenuItems);

		return (
			<Select
				value={value}
				onChange={this.handleChange}
				classes={{ root: 'dropdown-select', icon: 'dropdown-select__icon' }}
			>
				{items}
			</Select>
		);
	}

	/**
	 * Get selected value index
	 * @private
	 * @param {String | Number} value - The selected value
	 */
	private getSelectedIndex(value: string | number) {
		return typeof value === 'string' ? this.props.items.indexOf(value) : value;
	}

	/**
	 * Returns a MenuItem component
	 * @private
	 * @param {String} item - The textual item
	 * @param {Number} i - The array index
	 */
	private getMenuItems(item: any, i: number) {
		return <MenuItem key={i} value={item} className='dropdown-select__item'>{item}</MenuItem>;
	}

	/**
	 * Handles change of selected value
	 * @private
	 * @param {Object} event - The submitted event
	 */
	private handleChange = (event: any) => {
		const selected = this.getSelectedIndex(event.target.value);

		this.setState({ selected });
		this.props.onChange(selected);
	}
}
