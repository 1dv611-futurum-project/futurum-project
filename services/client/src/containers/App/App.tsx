/**
 * App container
 * @module containers/App/App
 */

import * as React from 'react';
import { Header } from '../../components/Header/Header';

/**
 * App class
 */
export class App extends React.Component<any, any> {

	public render() {
		return (
			<div className='app__wrapper'>
				<div className='app__sidebar'>
					<Header />
				</div>
				<div className='app__content'>
					{this.props.children}
				</div>
			</div>
		);
	}
}
