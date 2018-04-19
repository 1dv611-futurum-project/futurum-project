/**
 * App container
 * @module containers/App/App
 */

import * as React from 'react';
import * as SocketIO from 'socket.io-client';
import { Header } from '../../components/Header/Header';

const mockData = [
	{
		type: 'ticket',
		id: 3,
		status: 2,
		assignee: 'Anton Myrberg',
		mailID: 'CACGfpvHcD9tOcJz8YT1CwiEO36VHhH1+-qXkCJhhaDQZd6-JKA@mail.gmail.com',
		created: '2018-04-17T17:56:58.000Z',
		title: 'Ett test',
		from: {
			name: 'Dev Devsson',
			email: 'dev@futurumdigital.se'
		},
		messages: [
			{
				received: '2018-04-17T17:56:58.000Z',
				body: 'Vi har mottagit ditt meddelande och återkommer inom kort. Mvh Anton Myrberg',
				fromCustomer: false
			},
			{
				received: '2018-04-17T17:56:58.000Z',
				body: 'adfafdasfa ',
				fromCustomer: true
			}
		]
	},
	{
		type: 'ticket',
		id: 0,
		status: 1,
		assignee: null,
		mailID: 'CACGfpvHcD9tOcJz8YT1CwiEO36VHhH1+-qXkCJhhaDQZd6-JKA@mail.gmail.com',
		created: '2018-04-17T17:56:58.000Z',
		title: 'Vi har ett problem',
		from: {
			name: 'Dev Devsson',
			email: 'dev@futurumdigital.se'
		},
		messages: [
			{
				received: '2018-04-17T17:56:58.000Z',
				body: 'adfafdasfa ',
				fromCustomer: true
			}
		]
	},
	{
		type: 'ticket',
		id: 6,
		status: 2,
		assignee: 'Sebastian Borgstedt',
		mailID: 'CACGfpvHcD9tOcJz8YT1CwiEO36VHhH1+-qXkCJhhaDQZd6-JKA@mail.gmail.com',
		created: '2018-04-17T17:56:58.000Z',
		title: 'Nu har det blivit tokigt',
		from: {
			name: 'Dev Devsson',
			email: 'dev@futurumdigital.se'
		},
		messages: [
			{
				received: '2018-04-17T17:56:58.000Z',
				body: 'adfafdasfa ',
				fromCustomer: true
			}
		]
	}
];

/**
 * App class
 */
export class App extends React.Component<any, any> {

	private static URL: string = 'http://localhost:8080';
	private io: SocketIOClient.Socket;

	constructor(props: any) {
		super(props);
		this.state = {
			tickets: mockData
		};

		this.io = SocketIO(App.URL, {
			path: '/socket'
		});
		this.listen();
	}

	/**
	 * Initiate socket handling
	 * @private
	 */
	private listen() {
		this.io.on('socket', (msg: any) => {
			if (!msg.id) {
				const newMessage = JSON.parse(msg);
				this.setState({ tickets: [...this.state.tickets, newMessage] });
			}
		});
	}

	public render() {
		return (
			<div className='app__wrapper'>
				<div className='app__sidebar'>
					<Header />
				</div>
				<div className='app__content'>
					{React.Children.map(this.props.children, (child: React.ReactElement<any>) =>
						React.cloneElement(child, {
							tickets: this.state.tickets
						})
					)}
				</div>
			</div>
		);
	}
}
