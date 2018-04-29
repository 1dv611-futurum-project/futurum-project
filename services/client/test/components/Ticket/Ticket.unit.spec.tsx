import * as mocha from 'mocha';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import * as moment from 'moment';
import 'moment/locale/sv';

import { Link } from 'react-router';
import { Card, CardHeader, CardActions } from 'material-ui';
import { Ticket } from '../../../src/components/Ticket/Ticket';
import { StatusSelect } from '../../../src/components/StatusSelect/StatusSelect';

describe('<Ticket />', () => {
	let wrapper: any;
	const props = {
		ticket: {
			id: '0',
			title: 'title',
			from: {
				name: 'name',
				email: 'email'
			},
			created: '2018-04-27T23:25:05.000Z',
			assignee: 'assignee',
			status: 0
		},
		onSend: (fn: any) => fn
	};

	before(() => {
		wrapper = shallow(<Ticket {...props}/>);
	});

	it('should have a Link to the ticket', () => {
		expect(wrapper.find(`Link[to="ticket-${props.ticket.id}"]`)).to.have.length(1);
	});

	it('should have a title', () => {
		expect(wrapper.find(CardHeader).props()).to.have.property('title', props.ticket.title);
	});

	it('should have an author', () => {
		expect(wrapper.find(CardHeader).props()).to.have.property('subheader', props.ticket.from.name);
	});

	it('should have a ticket ID', () => {
		expect(wrapper.find('.ticket__id').text()).to.equal('#' + props.ticket.id);
	});

	it('should have a ticket created date in core format', () => {
		const expectedDateString = '27 april 2018';
		expect(wrapper.find('.ticket__content__information').at(0).text())
			.to.equal('Mottaget: ' + expectedDateString);
	});

	it('should have a ticket assignee', () => {
		expect(wrapper.find('.ticket__content__information').at(1).text())
			.to.equal('Tilldelat: ' + props.ticket.assignee);
	});
});
