import * as mocha from 'mocha';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { MenuItem, Select } from 'material-ui';
import { DropDownSelect } from '../../../src/components/DropDownSelect/DropDownSelect';
import { StatusSelect } from '../../../src/components/StatusSelect/StatusSelect';

describe('<StatusSelect />', () => {
	let wrapper: any;
	const props: any = {
		selected: 0,
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

	it('should have correct status texts', () => {
		const expected = Object.values(statusCodes);
		expect(wrapper.state().statuses).to.have.members(expected);
	});

	it('should get status and status text on select', () => {
		const expected = 0;

		props.onChange = (status: number, statusText: string) => {
			expect(status).to.equal(expected);
			expect(statusText).to.equal(statusCodes[expected]);
		};
		wrapper = shallow(<StatusSelect {...props}/>);

		const dropDownSelect = wrapper.find(DropDownSelect).dive();
		dropDownSelect.find(Select).simulate('change', {target: { value : statusCodes[expected]}});
	});
});
