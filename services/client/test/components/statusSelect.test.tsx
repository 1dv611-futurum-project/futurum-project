import * as mocha from 'mocha';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { SelectField, MenuItem } from 'material-ui';
import { StatusSelect } from '../../src/components/StatusSelect/StatusSelect';

describe('<StatusSelect />', () => {
	let wrapper: any;
	const props: any = { status: '', onChange: (fn: any) => fn };

	before(() => {
		wrapper = shallow(<StatusSelect {...props}/>);
	});

	it('should have a SelectField', () => {
		expect(wrapper.find(SelectField)).to.have.length(1);
	});

	it('should have value & onChange-properties for SelectField', () => {
		expect(wrapper.find(SelectField).props())
			.to.include.all.keys('value', 'onChange');
	});

	it('should have style-properties for SelectField', () => {
		expect(wrapper.find(SelectField).props())
			.to.include.all.keys('style', 'menuItemStyle', 'iconStyle', 'labelStyle');
	});

	it('should have 4 MenuItems', () => {
		expect(wrapper.find(MenuItem)).to.have.length(4);
	});

	it('should have value "Ej påbörjad" in the 1st MenuItem', () => {
		expect(wrapper.find(MenuItem).at(0).props()).to.have.property('value', 'Ej påbörjad');
	});

	it('should have value "Påbörjad" in the 2nd MenuItem', () => {
		expect(wrapper.find(MenuItem).at(1).props()).to.have.property('value', 'Påbörjad');
	});

	it('should have value "Genomförd" in the 3rd MenuItem', () => {
		expect(wrapper.find(MenuItem).at(2).props()).to.have.property('value', 'Genomförd');
	});

	it('should have value "Stängd" in the 4th MenuItem', () => {
		expect(wrapper.find(MenuItem).at(3).props()).to.have.property('value', 'Stängd');
	});
});
