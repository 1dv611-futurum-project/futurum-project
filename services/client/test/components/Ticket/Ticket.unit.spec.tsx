import * as mocha from 'mocha';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { Link } from 'react-router';
import { Card, CardHeader, CardActions } from 'material-ui';
import { Ticket } from '../../../src/components/Ticket/Ticket';
import { StatusSelect } from '../../../src/components/StatusSelect/StatusSelect';

describe('<Ticket />', () => {
	let wrapper: any;
	const props = { data: {
		id: '0',
		title: 'title',
		author: 'author',
		created: 'created',
		assignee: 'assignee',
		status: 'status'
	}};

	before(() => {
		wrapper = shallow(<Ticket {...props}/>);
	});

	it('should have a Link to the ticket', () => {
		expect(wrapper.find(`Link[to="ticket-${props.data.id}"]`)).to.have.length(1);
	});

	it('should have a title', () => {
		expect(wrapper.find(CardHeader).props()).to.have.property('title', props.data.title);
	});

	it('should have an author', () => {
		expect(wrapper.find(CardHeader).props()).to.have.property('subheader', props.data.author);
	});

	it('should have a ticket ID', () => {
		expect(wrapper.find('.ticket__id').text()).to.equal('#' + props.data.id);
	});

	it('should have a ticket created', () => {
		expect(wrapper.find('.ticket__content__information').at(0).text())
			.to.equal('Mottaget: ' + props.data.created);
	});

	it('should have a ticket assignee', () => {
		expect(wrapper.find('.ticket__content__information').at(1).text())
			.to.equal('Tilldelat: ' + props.data.assignee);
	});

	it('should have a ticket status', () => {
		expect(wrapper.find(StatusSelect).props().status).to.equal(props.data.status);
	});

	it('should have a list of statuses to choose from', () => {
		expect(wrapper.find(StatusSelect)).to.have.length(1);
	});
});
