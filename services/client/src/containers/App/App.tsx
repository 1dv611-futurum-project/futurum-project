/**
 * App container
 * @module containers/App/App
 */

import * as React from 'react';
import * as io from 'socket.io-client';
import { Header } from '../../components/Header/Header';
import WebsocketHandler from '../../handlers/WebsocketHandler';

/**
 * App class
 */
export class App extends React.Component<any, any> {
	private websocketHandler: WebsocketHandler;

	constructor(props: any) {
		super(props);
		this.websocketHandler = new WebsocketHandler();
		this.onTicket();
		this.onCustomer();
		this.onSettings();

		this.state = {
			tickets: [
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
			]
		};
	}

	/*
	 * Receive incoming ticket(s) and set appropriate state.
	 */
	private onTicket(): void {
		this.websocketHandler.ticket( (ticket: any) => {
			try {
				console.log('ticket:   ' + ticket);
				ticket = JSON.parse(ticket);
				this.state.tickets.push(ticket);
			// this.setState( );
			} catch (error) {
				console.error(error);
			}
		});
	}

	/*
	 * Receive incoming settings and set appropriate state.
	 */
	private onSettings(): void {
		this.websocketHandler.settings( (settings: any) => {
			// Todo
		});
	}

	/*
	 * Receive incoming customer(s) and set appropriate state.
	 */
	private onCustomer(): void {
		this.websocketHandler.customer( (customer: any) => {
			// Todo
		});
	}

	/**
	 * componentDidMount
	 * @public
	 */
	public componentDidMount() {
		this.startSocket();
	}

	/**
	 * Initiate socket handling
	 * @private
	 */
	private startSocket() {
		const socket = io('http://localhost:8080', {
			path: '/socket'
		});

		socket.on('connect', () => {
			console.log('client connected in App');
		});

		socket.on('socket', (msg: any) => {
			console.log(msg);
			if (!msg.id) {
				const newMessage = JSON.parse(msg);
				this.setState({ tickets: [...this.state.tickets, newMessage] });
			}

			// For testing with mock-data
			// const mockMessage: any = {
			// 	type: 'ticket',
			// 	id: 10,
			// 	status: 0,
			// 	assignee: null,
			// 	mailID: 'CACGfpvHcD9tOcJz8YT1CwiEO36VHhH1+-qXkCJhhaDQZd6-JKA@mail.gmail.com',
			// 	created: '2018-04-17T17:56:58.000Z',
			// 	title: 'Ett felrapporterat ärende',
			// 	from: {
			// 		name: 'Dev Devsson',
			// 		email: 'dev@futurumdigital.se'
			// 	},
			// 	messages: [
			// 		{
			// 			received: '2018-04-17T17:56:58.000Z',
			// 			body: 'adfafdasfa ',
			// 			fromCustomer: true
			// 		}
			// 	]
			// };
			//
			// this.setState({ tickets: [...this.state.tickets, mockMessage] });
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
