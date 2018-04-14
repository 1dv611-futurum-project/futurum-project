/**
 * App container
 * @module containers/App/App
 */

import * as React from 'react';
import { lightBaseTheme, MuiThemeProvider, getMuiTheme } from 'material-ui/styles';
import WebSocketClientHandler from '../../handlers/WebsocketHandler';

import { Header } from '../../components/Header/Header';

/**
 * App class
 */
export class App extends React.Component<any, any> {

	
	
	

	private recieveSocketMessage(): void {


	}

	private sendSocketMessage(): void {
		

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
