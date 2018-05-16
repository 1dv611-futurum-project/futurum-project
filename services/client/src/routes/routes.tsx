/**
 * Routes for client application
 */
import * as React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

/**
 * Containers
 */
import { App } from '../containers/App/App';
import { AllTicketsPage } from '../containers/AllTicketsPage/AllTicketsPage';
import { ClientListPage } from '../containers/ClientListPage/ClientListPage';
import { SettingsPage } from '../containers/SettingsPage/SettingsPage';
import { TicketPage } from '../containers/TicketPage/TicketPage';
import { ErrorPage } from '../containers/ErrorPage/ErrorPage';

/**
 * Routes to export
 */
export default (
	<Route path='/' component={App}>
		<IndexRoute component={AllTicketsPage} />
		<Route path='open' component={AllTicketsPage} />
		<Route path='in-progress' component={AllTicketsPage} />
		<Route path='closed' component={AllTicketsPage} />
		<Route path='clients' component={ClientListPage} />
		<Route path='settings' component={SettingsPage} />
		<Route path='ticket-:id' component={TicketPage} />
		<Route path='/404' component={ErrorPage} />
		<Redirect from='*' to='/404' />
	</Route>
);
