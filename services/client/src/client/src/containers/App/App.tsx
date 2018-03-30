/**
 * App container
 * @module containers/App/App
 */

import * as React from 'react';
import { lightBaseTheme, MuiThemeProvider, getMuiTheme } from 'material-ui/styles';

import { Header } from '../../components/Header/Header';


/**
 * App class
 */
export class App extends React.Component<any, any> {
  public render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <Header />
      </MuiThemeProvider>
    );
  }
}
