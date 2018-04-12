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
		handleClick: () => {return; },
		handleStatusChange: (fn: number) => fn,
		status: 0,
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
	const statusCodes = {
		0: 'Ej påbörjad',
		1: 'Påbörjad',
		2: 'Genomförd',
		3: 'Stängd'
	}  as any;

	before(() => {
		wrapper = shallow(<TicketOverview {...props}/>);
	});

	it('should have correct status color', () => {
		const colors = ['red', 'blue', 'green', 'green'];

		// tslint:disable-next-line:forin
		for (const status in statusCodes) {
			props.status = JSON.parse(status);
			wrapper = shallow(<TicketOverview {...props}/>);

			const color = wrapper.state('color');

			expect(color).to.equal(colors[JSON.parse(status)]);
			expect(wrapper.find(`.ticket-overview__color--${color}`)).to.have.length(1);
		}
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
