import * as mocha from 'mocha';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { Link } from 'react-router';
import { Card, CardHeader, CardText, CardActions } from 'material-ui';
import { Ticket } from '../../src/components/Ticket/Ticket';
import { StatusSelect } from '../../src/components/StatusSelect/StatusSelect';

describe('<Ticket />', () => {
	let wrapper: any;
	const props = { data: {
		id: '0',
		title: 'title',
		author: 'author',
		created: 'created',
		assigned: 'assigned',
		status: 'status'
	}};

	before(() => {
		wrapper = shallow(<Ticket {...props}/>);
	});

	it('should have a Card', () => {
		expect(wrapper.find(Card)).to.have.length(1);
	});

	it('should have a CardHeader with title & author', () => {
		expect(wrapper.find(CardHeader).props()).to.have.property('title', props.data.title);
		expect(wrapper.find(CardHeader).props()).to.have.property('subtitle', props.data.author);
	});

	it('should have a CardText', () => {
		expect(wrapper.find(CardText)).to.have.length(1);
	});

	it('should have a CardActions', () => {
		expect(wrapper.find(CardActions)).to.have.length(1);
	});

	it('should have a StatusSelect', () => {
		expect(wrapper.find(StatusSelect)).to.have.length(1);
	});

	it('should have a Link', () => {
		expect(wrapper.find(Link)).to.have.length(1);
	});

	it('should have a ticket ID', () => {
		expect(wrapper.find('.ticket__id').text()).to.equal('#' + props.data.id);
	});

	it('should have a ticket created', () => {
		expect(wrapper.find('.ticket__information').at(0).text())
			.to.equal('Mottaget: ' + props.data.created);
	});

	it('should have a ticket assigned', () => {
		expect(wrapper.find('.ticket__information').at(1).text())
			.to.equal('Tilldelat: ' + props.data.assigned);
	});

	it('should have a ticket status', () => {
		expect(wrapper.find('.ticket__information').at(1).text())
			.to.equal('Tilldelat: ' + props.data.assigned);
	});
});
