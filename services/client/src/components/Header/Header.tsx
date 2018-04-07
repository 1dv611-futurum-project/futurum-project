/**
 * Header component
 * @module components/Header/Header
 */

import * as React from 'react';
import { Paper, Menu, MenuItem, Divider } from 'material-ui';
import { RemoveRedEye, AccountCircle, Settings } from 'material-ui-icons';
import { Link } from 'react-router';

/**
 * Header class
 */
export class Header extends React.Component<any, any> {
	public render() {
		return (
			<Paper className='header'>
				<Link to='/' className='header__link'>
					<MenuItem>Alla ärenden</MenuItem>
				</Link>
				<span className='header__color header__color--red' />
				<Link to='/' className='header__link'>
					<MenuItem>Ej påbörjad ärenden</MenuItem>
				</Link>
				<span className='header__color header__color--blue' />
				<Link to='/' className='header__link'>
					<MenuItem>Påbörjade ärenden</MenuItem>
				</Link>
				<span className='header__color header__color--green' />
				<Link to='/' className='header__link'>
					<MenuItem>Avslutade ärenden</MenuItem>
				</Link>

				<Divider />

				<Link to='/clients' className='header__link'>
					<MenuItem>Kundlista <AccountCircle className='header__link__icon' /></MenuItem>
				</Link>
				<Link to='/settings' className='header__link'>
					<MenuItem>Inställningar <Settings className='header__link__icon' /></MenuItem>
				</Link>
			</Paper>
		);
	}
}
