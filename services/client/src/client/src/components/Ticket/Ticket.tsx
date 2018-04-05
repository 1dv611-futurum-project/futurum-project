/**
 * Ticket component
 * @module components/Ticket/Ticket
 */

import * as React from 'react';
import { Card, CardHeader, CardText } from 'material-ui';

/* Custom Material Design styling */
const style = {
	card: {
  		width: 290,
		position: 'relative' as 'relative',
		margin: '0 10px 20px 10px'
  	},
	header: {
		paddingRight: 0
	},
	title: {
		marginTop: '10px',
		fontWeight: 'bold' as 'bold',
		fontSize: '14px'
	},
	subtitle: {
		fontSize: '12px'
	},
	text: {
		paddingTop: 0
	}
};

/**
 * Ticket class
 */
export class Ticket extends React.Component<any, any> {
  public render() {
	const { id, assigned, received, title, author, color } = this.props;
	let colorClasses = `ticket__color ticket__color--${color}`;
	  
    return (
		<Card style={style.card}>
			<span className={colorClasses} />
			<p className='ticket__id'>#{id}</p>
			<a href='#' className='ticket__header'>
				<CardHeader title={title} subtitle={author} textStyle={style.header} titleStyle={style.title} subtitleStyle={style.subtitle} />
			</a>
			<CardText style={style.text}>
				<p className='ticket__information'>Mottaget: {received}</p>
				<p className='ticket__information'>Tilldelat: <span className='ticket__information--bold'>{assigned}</span></p>
			</CardText>
		</Card>
    );
  }
}
