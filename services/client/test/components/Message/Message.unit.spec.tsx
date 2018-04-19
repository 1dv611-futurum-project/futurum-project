import * as mocha from 'mocha';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { Button } from 'material-ui';
import { Message } from '../../../src/components/Message/Message';

describe('<Message />', () => {
	let wrapper: any;
	const props = {
		data: {
			fromCustomer: true,
			received: 'received',
			body: 'body'
		},
		customer: 'customer',
		assignee: 'assignee'
	};

	before(() => {
		wrapper = shallow(<Message {...props}/>);
	});

	it('should have an author and a date', () => {
		const expected = props.customer + ', ' + props.data.received;
		expect(wrapper.find('.message__content__title').text()).to.equal(expected);
	});

	it('should have a message', () => {
		expect(wrapper.find('.message__content__text').text()).to.equal(props.data.body);
	});
});
