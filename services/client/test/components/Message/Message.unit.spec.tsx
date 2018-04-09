import * as mocha from 'mocha';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { Button } from 'material-ui';
import { Message } from '../../../src/components/Message/Message';

describe('<Message />', () => {
	let wrapper: any;
	const props = { data: {
		author: 'author',
		date: 'date',
		message: 'message'
	}};

	before(() => {
		wrapper = shallow(<Message {...props}/>);
	});

	it('should have an author and a date', () => {
		let expected = props.data.author + ', ' + props.data.date
		expect(wrapper.find('.message__content__title').text()).to.equal(expected);
	});

	it('should have a message', () => {
		expect(wrapper.find('.message__content__text').text()).to.equal(props.data.message);
	});
});
