/**
 * App container
 * @module containers/App/App
 */

import * as React from 'react';
import SocketFactory from '../../handlers/socket/SocketFactory';
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
			assignees: [],
			customers: [],
			settings: [],
		};

		this.socket = new SocketFactory();
		this.ticketsListener();
		this.assigneesListener();
		this.customersListener();
		this.settingsListener();
	}

	public ticketsListener() {
		this.socket.ticketChannel().onTickets((tickets: any) => {
			tickets = JSON.parse(tickets);
			this.setState({ tickets });
		});
	}

	public assigneesListener() {
		this.socket.assigneeChannel().onAssignees((assignees: any) => {
			assignees = JSON.parse(assignees);
			this.setState({ assignees });
		});
	}

	public customersListener() {
		this.socket.customerChannel().onCustomers((customers: any) => {
			customers = JSON.parse(customers);
			this.setState({ customers });
		});
	}

	public settingsListener() {
		this.socket.settingChannel().onSettings((settings: any) => {
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
			allAssignees: this.state.assignees,
			allCustomers: this.state.customers,
			allSettings: this.state.settings,
			ticketAction: this.socket.ticketChannel(),
			customerAction: this.socket.customerChannel(),
			settingsAction: this.socket.settingChannel()
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
