/**
 * Header component
 * @module components/Header/Header
 */

import * as React from 'react';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import {
	RemoveRedEye,
	Help,
	WatchLater,
	CheckCircle,
	AccountCircle,
	Settings
} from 'material-ui-icons';


/* Custom Material Design styling */
const style = {
	paper: {
		display: 'inline-block',
		float: 'left',
		margin: '16px 32px 16px 32px',
		position: 'relative'
	},
	rightIcon: {
		textAlign: 'center',
		lineHeight: '24px'
	},
	divider: {
		marginTop: '0',
		marginBottom: '0'
	}
};


/**
 * Header class
 */
export class Header extends React.Component<any, any> {
	public render() {
		return (
			<Paper style={style.paper}>
				<Menu>
					<MenuItem primaryText='Alla ärenden' rightIcon={<RemoveRedEye />} />
					<span className='header__color header__color--red'></span>
					<MenuItem primaryText='Ej påbörjade ärenden' />
					<span className='header__color header__color--blue'></span>
					<MenuItem primaryText='Påbörjade ärenden' />
					<span className='header__color header__color--green'></span>
					<MenuItem primaryText='Avslutade ärenden' />
					<Divider style={style.divider} />
					<MenuItem primaryText='Kundlista' rightIcon={<AccountCircle />} />
					<MenuItem primaryText='Inställningar' rightIcon={<Settings />} />
				</Menu>
			</Paper>
		);
	}
}