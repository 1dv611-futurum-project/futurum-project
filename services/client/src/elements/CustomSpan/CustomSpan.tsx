/**
 * CustomSpan component
 * @module components/CustomSpan/CustomSpan
 */

import * as React from 'react';
import * as cx from 'classnames';

/**
 * CustomSpan Props Interface
 */
export interface ICustomSpan {
	status: number;
	wide?: boolean;
	small?: boolean;
}

/**
 * CustomSpan class
 */
export class CustomSpan extends React.Component<ICustomSpan, any> {

	constructor(props: any) {
		super(props);
		this.state = {
			color: this.getStatusColor(this.props.status),
		};
	}

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const { status, wide, small } = this.props;

		const spanClasses = cx({
			'ticket__color ticket__color--': wide,
			'ticket-overview__color ticket-overview__color--': small,
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
