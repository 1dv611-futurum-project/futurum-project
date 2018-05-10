/**
 * App container
 * @module containers/App/App
 */
import * as React from 'react';
import SocketFactory from '../../handlers/socket/SocketFactory';

import { Header } from '../../components/Header/Header';
import { Modal } from '../../components/Modal/Modal';
import { SnackbarNotice } from '../../components/SnackbarNotice/SnackbarNotice';

/**
 * App class
 */
export class App extends React.Component<any, any> {

	private socket: SocketFactory;

	constructor(props: any) {
		super(props);
		this.state = {
			isLoggedIn: true,
			tickets: [],
			assignees: [],
			customers: [],
			settings: [],
			snackMessage: '',
			snackState: false
		};

		this.socket = new SocketFactory();
		this.authListener();
		this.ticketsListener();
		this.assigneesListener();
		this.customersListener();
		this.settingsListener();
		this.messageListener();
	}

	/**
	 * Listens to validity state of token received when authenticated
	 * @private
	 */
	private authListener() {
		this.socket.isValidToken((isLoggedIn: boolean) => {
			this.setState({ isLoggedIn });
		});
	}

	/**
	 * Listens to the event of new incoming tickets
	 * @private
	 */
	private ticketsListener() {
		this.socket.ticketChannel().onTickets((tickets: any) => {
			tickets = JSON.parse(tickets);
			this.setState({ tickets });
		});
	}

	/**
	 * Listens to the event of newly added assignees
	 * @private
	 */
	private assigneesListener() {
		this.socket.assigneeChannel().onAssignees((assignees: any) => {
			assignees = JSON.parse(assignees);
			this.setState({ assignees });
		});
	}

	/**
	 * Listens to the event of newly added customers to customer list
	 * @private
	 */
	private customersListener() {
		this.socket.customerChannel().onCustomers((customers: any) => {
			customers = JSON.parse(customers);
			this.setState({ customers });
		});
	}

	/**
	 * Listens to the event of newly added/updated settings
	 * @private
	 */
	private settingsListener() {
		this.socket.settingChannel().onSettings((settings: any) => {
			settings = JSON.parse(settings);
			this.setState({ settings });
		});
	}

	/**
	 * Listens to the event of newly added/updated settings
	 * @private
	 */
	private messageListener() {
		this.socket.messageChannel().onMessage((message: any) => {
			message = JSON.parse(message);
			this.setState({
				snackMessage: message,
				snackState: true,
			});
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
			settingsAction: this.socket.settingChannel(),
			messageAction: this.socket.messageChannel()
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
				{ !this.state.isLoggedIn ?
					<Modal
						title='Du är inte inloggad'
						message='Logga in igen för att hämta ärenden'
						agree='Logga in'
						onChange={(doLogin: boolean) => {
							window.location.href = '/node/auth/gmail';
						}}
					/>
					: null }
				<SnackbarNotice
					message={this.state.snackMessage}
					open={this.state.snackState}
					onClose={() => this.setState({ snackState: false })}
				/>
			</div>
		);
	}
}
