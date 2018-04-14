/**
 * App container
 * @module containers/App/App
 */

import * as React from 'react';
import { lightBaseTheme, MuiThemeProvider, getMuiTheme } from 'material-ui/styles';
import * as io from 'socket.io-client';

import { Header } from '../../components/Header/Header';

const socket = io.connect('http://localhost:3000/');

/**
 * App class
 */
export class App extends React.Component<any, any> {

	public componentDidMount() {
		socket.on('connect', () => {
			console.log('connected!');
			socket.emit('started!');

			socket.on('message', (m: any) => {
				console.log(m);
			});
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
			<MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
				<div className='app__wrapper'>
					<div className='app__sidebar'>
						<Header />
					</div>
					<div className='app__content'>
						{this.props.children}
					</div>
				</div>
			</MuiThemeProvider>
		);
	}
}
