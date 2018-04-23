/**
 * App container
 * @module containers/App/App
 */

import * as React from 'react';
import SocketFactory from '../../handlers/SocketFactory';
import { Header } from '../../components/Header/Header';

/**
 * App class
 */
export class App extends React.Component<any, any> {

	private socket: SocketFactory;

	constructor(props: any) {
		super(props);
		this.state = {
			tickets: [],
			customers: []
		};

		this.socket = new SocketFactory();
	}

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const childProps = {
			tickets: this.socket.tickets(),
			customers: this.socket.customers(),
			settings: this.socket.settings()
		};

		return (
			<div className='app__wrapper'>
				<div className='app__sidebar'>
					<Header />
				</div>
				<div className='app__content'>
					{React.Children.map(this.props.children, (child: React.ReactElement<any>) =>
						React.cloneElement(child, childProps)
					)}
				</div>
			</div>
		);
	}
}
