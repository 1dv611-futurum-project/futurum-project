/**
 * StatusColor component
 * @module components/StatusColor/StatusColor
 */
import * as React from 'react';
import { Button } from 'material-ui';
import { SketchPicker } from 'react-color';

/**
 * StatusColor Props Interface
 */
export interface IStatusColor {
	color: string;
	status: string;
	onChange(color: any): void;
}

/**
 * Proof Of Concept
 * StatusColor class
 */
export class StatusColor extends React.Component<IStatusColor, any> {

	constructor(props: any) {
		super(props);

		this.state = {
			displayColorPicker: false,
			color: this.props.color
		};
	}

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const { color, status } = this.props;

		return (
				<div className='status-color__select' onClick={this.handleClick}>
					{this.state.displayColorPicker ?
						<SketchPicker color={this.state.color} onChange={this.handleChange} />
						: <div>
							<Button
								variant='raised'
								className={`status-color status-color--${color}`}
								onClick={() => this.setState({ displayColorPicker: false })}
							>
								&nbsp;
							</Button>
							<span className='status-color__desc'>{status}</span>
						</div>
					}
				</div>
		);
	}

	/**
	 * Gets the correct color.
	 * @private
	 * @param {String} color - The color as a string
	 */
	private getColor(color: string) {
		switch (color) {
			case 'red':
				this.setState({ color: '#f1453d' });
				break;
			case 'blue':
				this.setState({ color: '#1fbcd2' });
				break;
			case 'green':
				this.setState({ color: '#50ae55' });
				break;
		}
	}

	/**
	 * Handles click on color picker
	 * @private
	 */
	private handleClick = () => {
		this.setState({ displayColorPicker: !this.state.displayColorPicker });
	}

	/**
	 * Handels change
	 * @private
	 * @param {Any} color - The newly selected color
	 */
	private handleChange = (color: any) => {
		this.setState({ color });
		this.props.onChange(color);
	}
}
