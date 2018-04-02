import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';

import { App } from './containers/App/App';
import './assets/sass/main.scss';
import routes from './routes';

ReactDOM.render(
	<Router history={browserHistory} routes={routes} />,
	document.getElementById('app')
);
