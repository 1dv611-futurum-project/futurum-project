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

const style = {
  paper: {
    display: 'inline-block',
    float: 'left',
    margin: '16px 32px 16px 32px',
  },
  rightIcon: {
    textAlign: 'center',
    lineHeight: '24px',
  },
};

export class Header extends React.Component<any, any> {
  public render() {
    return (
    <Paper style={style.paper}>
      <Menu>
        <MenuItem primaryText='Alla ärenden' rightIcon={<RemoveRedEye />} />
        <MenuItem primaryText='Ej påbörjade ärenden' />
        <MenuItem primaryText='Påbörjade ärenden' />
        <MenuItem primaryText='Avslutade ärenden' />
        <Divider />
        <MenuItem primaryText='Kundlista' rightIcon={<AccountCircle />} />
        <MenuItem primaryText='Inställningar' rightIcon={<Settings />} />
      </Menu>
    </Paper>
    );
  }
}
