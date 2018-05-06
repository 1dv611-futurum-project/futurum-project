import * as mocha from 'mocha';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { Card, CardHeader, CardActions } from 'material-ui';
import { TicketOverview } from '../../../src/components/TicketOverview/TicketOverview';
import { AddButton } from '../../../src/components/AddButton/AddButton';
import { StatusSelect } from '../../../src/components/StatusSelect/StatusSelect';
import { DropDownSelect } from '../../../src/components/DropDownSelect/DropDownSelect';
import Span from '../../../src/elements/CustomSpan/CustomSpan';

describe('<TicketOverview />', () => {
	let wrapper: any;
	const props = {
		handleClick: () => {return; },
		handleStatusChange: (fn: number) => fn,
		handleAssigneeChange: (fn: string) => fn,
		assignees: ['assignee'],
		ticket: {
			id: 'id',
			status: 0,
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

	it('should have correct status color', () => {
		// tslint:disable-next-line:forin
		for (const status in statusCodes) {
			const statusInt = JSON.parse(status);
			wrapper = newWrapperProps(statusInt);
			expect(wrapper.find(Span).dive().state('color')).to.equal(colors[statusInt]);
		}
	});

	function newWrapperProps(status: number): any {
		props.ticket.status = status;
		return shallow(<TicketOverview {...props}/>).dive();
	}

	it('should have a list of statuses to choose from', () => {
		expect(wrapper.find(StatusSelect)).to.have.length(1);
	});

	it('should have a list of assignees to choose from', () => {
		expect(wrapper.find(DropDownSelect)).to.have.length(1);
	});

	it('should have an answer button', () => {
		expect(wrapper.find(AddButton)).to.have.length(1);
	});
});
