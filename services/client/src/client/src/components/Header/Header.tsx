/**
 * Header component
 * @module components/Header/Header
 */

import * as React from 'react';
import { Paper, Menu, MenuItem, Divider } from 'material-ui';
import { RemoveRedEye, AccountCircle, Settings } from 'material-ui-icons';
import { Link } from 'react-router';

/* Custom Material Design styling */
import { headerStyle } from '../../variables/Variables';

/**
 * Header class
 */
export class Header extends React.Component<any, any> {
	public render() {
		return (
			<Paper style={headerStyle.paper}>
				<Menu>
					<Link to='/' className='header__link'>
						<MenuItem primaryText='Alla ärenden' />
					</Link>
					<span className='header__color header__color--red' />
					<Link to='/' className='header__link'>
						<MenuItem primaryText='Ej påbörjade ärenden' />
					</Link>
					<span className='header__color header__color--blue' />
					<Link to='/' className='header__link'>
						<MenuItem primaryText='Påbörjade ärenden' />
					</Link>
					<span className='header__color header__color--green' />
					<Link to='/' className='header__link'>
						<MenuItem primaryText='Avslutade ärenden' />
					</Link>

					<Divider style={headerStyle.divider} />

					<Link to='/clients' className='header__link'>
						<MenuItem primaryText='Kundlista' rightIcon={<AccountCircle />} />
					</Link>
					<Link to='/settings' className='header__link'>
						<MenuItem primaryText='Inställningar' rightIcon={<Settings />} />
					</Link>
				</Menu>
			</Paper>
		);
	}
}
