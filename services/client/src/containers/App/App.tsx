/**
 * App container
 * @module containers/App/App
 */

import * as React from 'react';
import Socket from '../../Socket';
import { Header } from '../../components/Header/Header';


/**
 * App class
 */
export class App extends React.Component<any, any> {

	private socket: Socket;

	constructor(props: any) {
		super(props);
		this.state = {
			tickets: [],
			customers: []
		};

		this.socket = new Socket();
		this.listen();
		this.getTickets();
		this.getCustomers();
	}

	/**
	 * Get socket ticket listener
	 * @private
	 */
	private listen() {
		this.socket.onTicket((msg: any) => {
			if (!msg.id) {
				const newMessage = JSON.parse(msg);
				this.setState({ tickets: [...this.state.tickets, newMessage] });
			}
		});
	}

	private getTickets() {
		this.socket.onTickets((tickets: any) => {
			if (tickets) {
				tickets = JSON.parse(tickets);
				this.setState({ tickets });
			}
		});
	}

	private getCustomers() {
		this.socket.onCustomers((customers: any) => {
			if (customers) {
				customers = JSON.parse(customers);
				this.setState({ customers });
			}
		});
	}

	public render() {
		const childProps = {
			tickets: this.state.tickets,
			clients: this.state.customers
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