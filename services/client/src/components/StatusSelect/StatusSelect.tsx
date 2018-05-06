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

	private static STATUSES: string[] = ['Ej påbörjad', 'Påbörjad', 'Genomförd', 'Stängd'];

	constructor(props: any) {
		super(props);
		this.state = {
			statuses: StatusSelect.STATUSES,
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
				statuses: StatusSelect.STATUSES,
				selected: this.props.selected
			});
		}
	}

	/**
	 * The render method
	 * @public
	 */
	public render() {
		return (
			<span className='select'>
				<DropDownSelect
					selected={this.state.selected}
					items={this.state.statuses}
					onChange={this.handleChange}
				/>
			</span>
		);
	}

	/**
	 * Handles change when a new status is selected
	 * @private
	 * @param {Number} selected - The newly selected status (0-3)
	 */
	private handleChange = (selected: number): void => {
		this.setState({ selected });
		this.props.onChange(selected, this.state.statuses[selected]);
	}
}
