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
			customers: [],
			settings: [],
		};

		this.socket = new SocketFactory();
		this.ticketsListener();
		this.customersListener();
		this.settingsListener();
	}

	public ticketsListener() {
		this.socket.tickets().onAllTickets((tickets: any) => {
			tickets = JSON.parse(tickets);
			this.setState({ tickets });
		});
	}

	public customersListener() {
		this.socket.customers().onAllCustomers((customers: any) => {
			customers = JSON.parse(customers);
			this.setState({ customers });
		});
	}

	public settingsListener() {
		this.socket.settings().onSettings((settings: any) => {
			settings = JSON.parse(settings);
			this.setState({ settings });
		});
	}

	/**
	 * The render method
	 * @public
	 */
	public render() {
		const childProps = {
			allTickets: this.state.tickets,
			allCustomers: this.state.customers,
			allSettings: this.state.settings,
			ticketAction: this.socket.tickets(),
			customerAction: this.socket.customers(),
			settingsAction: this.socket.settings()
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
