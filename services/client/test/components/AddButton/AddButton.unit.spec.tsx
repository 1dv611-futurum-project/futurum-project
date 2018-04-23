import * as mocha from 'mocha';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { Button } from 'material-ui';
import { AddButton } from '../../../src/components/AddButton/AddButton';

describe('<AddButton />', () => {
	let wrapper: any;
	let count: number;
	const props = { text: 'test', onClick: () => { count++; }};

	before(() => {
		count = 0;
		wrapper = shallow(<AddButton {...props}/>);
	});

	it('should have a button text', () => {
		expect(wrapper.find('.add-btn__text').text()).to.equal(props.text);
	});

	it('should execute function on button click', () => {
		const expected = 1;

		wrapper.find(Button).simulate('click');
		expect(count).to.equal(expected);
	});
});
