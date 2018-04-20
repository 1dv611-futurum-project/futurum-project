import * as mocha from 'mocha';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { Button } from 'material-ui';
import { ClientInput } from '../../../src/components/ClientInput/ClientInput';

describe('<ClientInput />', () => {
	let wrapper: any;
	const props = {
		onClick: (fn: any) => fn,
		open: true
	};

	before(() => {
		wrapper = shallow(<ClientInput {...props}/>);
	});

	it('should show client input if open', () => {
		expect(wrapper.find('.client-input--hidden')).to.have.length(0);
	});

	it('should hide client input if not open', () => {
		props.open = false;
		wrapper = shallow(<ClientInput {...props}/>);

		expect(wrapper.find('.client-input--hidden')).to.have.length(1);
	});

	it('should submit the client input', () => {
		let expected;
		const input = {
			name: 'company',
			email: 'company@company.com'
		};

		props.onClick = (client: any) => { expected = client; };
		wrapper = shallow(<ClientInput {...props}/>);
		wrapper.setState({
			client: input
		});

		wrapper.find('form').simulate('submit', {
			preventDefault: (e: any) => e
		});
		expect(input).to.equal(expected);
	});
});
