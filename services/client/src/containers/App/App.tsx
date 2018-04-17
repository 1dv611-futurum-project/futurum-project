/**
 * App container
 * @module containers/App/App
 */

import * as React from 'react';
import { lightBaseTheme, MuiThemeProvider, getMuiTheme } from 'material-ui/styles';
import * as io from 'socket.io-client';
import { Header } from '../../components/Header/Header';

/**
 * App class
 */
export class App extends React.Component<any, any> {

	public componentDidMount() {
		this.startSocket();
	}

	private startSocket() {
		console.log('starting socket');
		const socket = io('http://localhost:8080', {
			path: '/socket'
		});

		socket.on('connect', () => {
			console.log('client connected');
		});
	}

	private receiveSocketMessage(): void {
		// TODO!
	}

	private sendSocketMessage(): void {
		// TODO!
	}

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
