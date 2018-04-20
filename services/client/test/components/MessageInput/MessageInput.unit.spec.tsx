import * as mocha from 'mocha';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import TextArea from 'react-textarea-autosize';
import { Button } from 'material-ui';
import { MessageInput } from '../../../src/components/MessageInput/MessageInput';

describe('<MessageInput />', () => {
	let wrapper: any;
	const props = {
		onClick: (message: string) => {return; },
		open: true
	};

	before(() => {
		wrapper = shallow(<MessageInput {...props}/>);
	});

	it('should show message input if open', () => {
		expect(wrapper.find('.message-input--hidden')).to.have.length(0);
	});

	it('should hide message input if not open', () => {
		props.open = false;
		wrapper = shallow(<MessageInput {...props}/>);

		expect(wrapper.find('.message-input--hidden')).to.have.length(1);
	});

	it('should update state on input', () => {
		wrapper.find(TextArea).simulate('change', {target: {value: 'test'}});
		expect(wrapper.state('message')).to.equal('test');
	});

	it('should send the input message', () => {
		let expected;
		const input = 'test';

		props.onClick = (message: string) => { expected = message; };
		wrapper = shallow(<MessageInput {...props}/>);
		wrapper.setState({ message: input });

		wrapper.find(Button).simulate('click');
		expect(input).to.equal(expected);
	});

});
