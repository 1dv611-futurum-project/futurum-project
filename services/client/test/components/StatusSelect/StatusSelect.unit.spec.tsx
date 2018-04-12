import * as mocha from 'mocha';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { MenuItem, Select } from 'material-ui';
import { StatusSelect } from '../../../src/components/StatusSelect/StatusSelect';

describe('<StatusSelect />', () => {
	let wrapper: any;
	const props: any = {
		status: 0,
		onChange: (fn: any) => fn
	};
	const statusCodes = {
		0: 'Ej påbörjad',
		1: 'Påbörjad',
		2: 'Genomförd',
		3: 'Stängd',
	} as any;

	before(() => {
		wrapper = shallow(<StatusSelect {...props}/>);
	});

	it('should have correct status text', () => {
		// tslint:disable-next-line:forin
		for (const status in statusCodes) {
			props.status = JSON.parse(status);
			wrapper = shallow(<StatusSelect {...props}/>);

			expect(wrapper.find(Select).props()).to.have.property('value', statusCodes[status]);
		}
	});

	it('should have value "Ej påbörjad" to choose from', () => {
		expect(wrapper.find(MenuItem).at(0).props().value).to.equal('Ej påbörjad');
	});

	it('should have value "Påbörjad" to choose from', () => {
		expect(wrapper.find(MenuItem).at(1).props().value).to.equal('Påbörjad');
	});

	it('should have value "Genomförd" to choose from', () => {
		expect(wrapper.find(MenuItem).at(2).props().value).to.equal('Genomförd');
	});

	it('should have value "Stängd" to choose from', () => {
		expect(wrapper.find(MenuItem).at(3).props().value).to.equal('Stängd');
	});

	it('should get status and status text on change', () => {
		const expected = 0;

		props.onChange = (status: number, statusText: string) => {
			expect(status).to.equal(expected);
			expect(statusText).to.equal(statusCodes[expected]);
		};
		wrapper = shallow(<StatusSelect {...props}/>);

		wrapper.find(Select).simulate('change', {target: { value : statusCodes[expected]}});
	});
});
