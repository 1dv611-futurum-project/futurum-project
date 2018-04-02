/**
 * App container
 * @module containers/App/App
 */

import * as React from 'react';
import { lightBaseTheme, MuiThemeProvider, getMuiTheme } from 'material-ui/styles';

import { Header } from '../../components/Header/Header';
import { Ticket } from '../../components/Ticket/Ticket';

/**
 * App class
 */
export class App extends React.Component<any, any> {
	
  /**
   * Creates a number of tickets to display
   */
  private getTickets() {
	  //TODO! Fix Tslint error --> 'tickets' implicitly has an 'any[]' type
	  let 	tickets = [],
	  	  	index = 0;

	  const colors = ['red', 'blue', 'green'],
	  		titles = ['Vi har ett problem', 'Applikationen fungerar inte', 'Kan ni hjälpa oss?', 'Vi har ett problem', 'Applikationen fungerar inte', 'Kan ni hjälpa oss?'],
			author = 'Johan Andersson',
			assigned = 'Anton Myrberg',
			received = '2 april 2018';

	
	  titles.forEach((title, i) => {
		  tickets.push(<Ticket key={i} color={colors[index]} title={title} author={author} assigned={assigned} received={received} id={i} />);
		  index == 2 ? index = 0 : index++;
	  });
	  
	  return tickets;
  }
	
	
  public render() {
	let tickets = this.getTickets();
	  
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
	  	<div className='app__wrapper'>
			<div className='app__sidebar'>
				<Header />
			</div>
			<div className='app__content'>
				<div className='tickets__wrapper'>
					{ tickets }
				</div>
			</div>
		</div>
      </MuiThemeProvider>
    );
  }
}
