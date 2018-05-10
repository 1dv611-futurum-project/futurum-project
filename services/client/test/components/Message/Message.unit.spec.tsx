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
			fromName: 'fromName',
			received: '2018-04-27T23:25:05.000Z',
			body: 'body'
		}
	};

	before(() => {
		wrapper = shallow(<Message {...props}/>);
	});

	it('should have an author and a date as locale convention', () => {
		const expectedDateString = '2018-04-27';
		const expected = props.data.fromName + ', ' + expectedDateString;
		expect(wrapper.find('.message__content__title').text()).to.equal(expected);
	});

	it('should have a message', () => {
		expect(wrapper.find('.message__content__text').text()).to.equal(props.data.body);
	});
});
