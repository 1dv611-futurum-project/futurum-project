/**
 * ErrorPage container
 * @module containers/ErrorPage/ErrorPage
 */
import * as React from 'react';
import { Paper } from 'material-ui';

/**
 * ErrorPage class
 */
export class ErrorPage extends React.Component<any, any> {

	/**
	 * The render method
	 * @public
	 */
	public render() {
		return (
			<div className='tickets'>
				<h1 className='tickets__header tickets__header--error'>404 Not Found</h1>
				<p className='tickets__text'>Tyvärr, sidan du sökte verkar inte finnas.</p>
			</div>
		);
	}
}
