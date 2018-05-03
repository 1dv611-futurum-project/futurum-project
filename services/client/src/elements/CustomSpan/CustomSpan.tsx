/**
 * CustomSpan component
 * @module components/CustomSpan/CustomSpan
 */

import * as React from 'react';
import * as cx from 'classnames';

/**
 * CustomSpan class
 */
class CustomSpan extends React.Component<any, any> {

	constructor(props: any) {
		super(props);
		this.state = {
			color: this.getStatusColor(this.props.status),
		};
	}

	public componentDidUpdate(prevProps: any) {
		if (prevProps !== this.props) {
			this.setState({
				color: this.getStatusColor(this.props.status)
			});
		}
	}

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const { wide, small } = this.props;

		const spanClasses = cx({
			'ticket-overview__color ticket-overview__color--': wide,
			'ticket__color ticket__color--': small,
		});

		return (
			<span className={spanClasses + this.state.color} />
		);
	}

	/**
	 * Gets the status color
	 * @private
	 * @param {number} status - The status number (0-3)
	 */
	private getStatusColor(status: number): string {
		switch (status) {
			case 0:
				return'red';
			case 1:
				return 'blue';
			case 2:
			case 3:
				return 'green';
		}
	}
}

export default CustomSpan;
