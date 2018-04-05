/**
 * TicketPage container
 * @module containers/TicketPage/TicketPage
 */

import * as React from 'react';
import { Message } from '../../components/Message/Message';

/**
 * TicketPage class
 */
export class TicketPage extends React.Component<any, any> {

	public render() {
		const message = {
			from: 'Johan Andersson',
			date: '2018-04-05',
			message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce turpis est, iaculis sit amet ultrices luctus, hendrerit non metus. Nullam eget vehicula justo, at suscipit nisi. In hac habitasse platea dictumst. Sed aliquet congue justo eu pellentesque. Sed non aliquet ligula. Donec maximus, justo eget egestas varius, sem nunc rutrum libero, quis faucibus arcu lorem eu magna. Fusce ut augue justo. Phasellus consectetur dui at ligula placerat tincidunt.'
		};

		return (
			<div className='ticket__wrapper'>
				Ticket page.
				<Message data={message}/>
			</div>
		);
	}
}
