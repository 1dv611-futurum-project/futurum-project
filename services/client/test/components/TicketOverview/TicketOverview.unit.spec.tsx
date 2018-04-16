import * as mocha from 'mocha';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { Card, CardHeader, CardActions } from 'material-ui';
import { TicketOverview } from '../../../src/components/TicketOverview/TicketOverview';
import { AddButton } from '../../../src/components/AddButton/AddButton';
import { StatusSelect } from '../../../src/components/StatusSelect/StatusSelect';
import { DropDownSelect } from '../../../src/components/DropDownSelect/DropDownSelect';

describe('<TicketOverview />', () => {
	let wrapper: any;
	const props = {
		handleClick: () => {return; },
		handleStatusChange: (fn: number) => fn,
		handleAssigneeChange: (fn: string) => fn,
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
	const colors = ['red', 'blue', 'green', 'green'];
	const statusCodes = {
		0: 'Ej påbörjad',
		1: 'Påbörjad',
		2: 'Genomförd',
		3: 'Stängd'
	}  as any;

	before(() => {
		wrapper = shallow(<TicketOverview {...props}/>);
	});

	function getColorState(status: number) {
		props.status = status;
		wrapper = shallow(<TicketOverview {...props}/>);

		return wrapper.state('color');
	}

	it('should have correct status color', () => {
		// tslint:disable-next-line:forin
		for (const status in statusCodes) {
			const statusInt = JSON.parse(status);
			const color = getColorState(statusInt);

			expect(color).to.equal(colors[statusInt]);
		}
	});

	it('should have correct status color class', () => {
		// tslint:disable-next-line:forin
		for (const status in statusCodes) {
			const statusInt = JSON.parse(status);
			const color = getColorState(statusInt);

			expect(wrapper.find(`.ticket-overview__color--${color}`)).to.have.length(1);
		}
	});

	it('should have a list of statuses to choose from', () => {
		expect(wrapper.find('.ticket-overview__actions--status').find(StatusSelect)).to.have.length(1);
	});

	it('should have a list of assignees to choose from', () => {
		expect(wrapper.find('.ticket-overview__actions--assigned').find(DropDownSelect)).to.have.length(1);
	});

	it('should have an answer button', () => {
		expect(wrapper.find(AddButton)).to.have.length(1);
	});
});
