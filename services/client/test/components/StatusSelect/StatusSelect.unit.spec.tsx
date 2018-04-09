import * as mocha from 'mocha';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { MenuItem, Select } from 'material-ui';
import { StatusSelect } from '../../../src/components/StatusSelect/StatusSelect';

describe('<StatusSelect />', () => {
	let wrapper: any;
	const props: any = { status: 'test', onChange: (fn: any) => fn };

	before(() => {
		wrapper = shallow(<StatusSelect {...props}/>);
	});

	it('should have a status value', () => {
		expect(wrapper.find(Select).props()).to.have.property('value', props.status);
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
});
