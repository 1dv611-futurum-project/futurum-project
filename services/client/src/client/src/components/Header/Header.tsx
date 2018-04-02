/**
 * Header component
 * @module components/Header/Header
 */

import * as React from 'react';
import { Paper, Menu, MenuItem, Divider } from 'material-ui';
import { RemoveRedEye, AccountCircle, Settings } from 'material-ui-icons';

/* Custom Material Design styling */
const style = {
  paper: {
    display: 'inline-block',
    float: 'left',
    margin: '0 32px 16px 32px',
    position: 'relative' as 'relative'
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
        <MenuItem primaryText='Alla ärenden' />
        <span className='header__color header__color--red' />
        <MenuItem primaryText='Ej påbörjade ärenden' />
        <span className='header__color header__color--blue' />
        <MenuItem primaryText='Påbörjade ärenden' />
        <span className='header__color header__color--green' />
        <MenuItem primaryText='Avslutade ärenden' />
        <Divider style={style.divider} />
        <MenuItem primaryText='Kundlista' rightIcon={<AccountCircle />} />
        <MenuItem primaryText='Inställningar' rightIcon={<Settings />} />
      </Menu>
    </Paper>
    );
  }
}
