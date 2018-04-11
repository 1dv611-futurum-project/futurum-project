import * as mocha from 'mocha';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { Card, CardHeader, CardActions } from 'material-ui';
import { TicketOverview } from '../../../src/components/TicketOverview/TicketOverview';
import { AddButton } from '../../../src/components/AddButton/AddButton';
import { StatusSelect } from '../../../src/components/StatusSelect/StatusSelect';

describe('<TicketOverview />', () => {
	let wrapper: any;
	const props = {
		handleClick: () => {},
		handleStatusChange: () => {},
		status: '',
		data: {
			id: 'id',
			status: 'status',
			assignee: 'assignee',
			title: 'title',
			created: 'created',
			from: {
				name: 'name',
				email: 'email'
			},
			messages: [
				{
					received: 'received',
					from: 'from',
					body: 'body'
				},
				{
					received: 'received',
					from: 'from',
					body: 'body'
				}
			]
		}
	};

	before(() => {
		wrapper = shallow(<TicketOverview {...props}/>);
	});

	it('should get red status color from "Ej påbörjad"', () => {
		props.status = 'Ej påbörjad';
		wrapper = shallow(<TicketOverview {...props}/>);
		const color = wrapper.state('color');

		expect(color).to.equal('red');
		expect(wrapper.find(`.ticket-overview__color--${color}`)).to.have.length(1);
	});

	it('should get blue status color from "Påbörjad"', () => {
		props.status = 'Påbörjad';
		wrapper = shallow(<TicketOverview {...props}/>);
		const color = wrapper.state('color');

		expect(color).to.equal('blue');
		expect(wrapper.find(`.ticket-overview__color--${color}`)).to.have.length(1);
	});

	it('should get green status color from "Genomförd"', () => {
		props.status = 'Genomförd';
		wrapper = shallow(<TicketOverview {...props}/>);
		const color = wrapper.state('color');

		expect(color).to.equal('green');
		expect(wrapper.find(`.ticket-overview__color--${color}`)).to.have.length(1);
	});

	it('should get green status color from "Stängd"', () => {
		props.status = 'Stängd';
		wrapper = shallow(<TicketOverview {...props}/>);
		const color = wrapper.state('color');

		expect(color).to.equal('green');
		expect(wrapper.find(`.ticket-overview__color--${color}`)).to.have.length(1);
	});

	it('should have a list of statuses to choose from', () => {
		expect(wrapper.find('.ticket-overview__actions--status').find(StatusSelect)).to.have.length(1);
	});

	it('should have a list of assignees to choose from', () => {
		expect(wrapper.find('.ticket-overview__actions--assigned').find(StatusSelect)).to.have.length(1);
	});

	it('should have an answer button', () => {
		expect(wrapper.find(AddButton)).to.have.length(1);
	});
});
