import * as mocha from 'mocha';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { MenuItem, Select } from 'material-ui';
import { DropDownSelect } from '../../../src/components/DropDownSelect/DropDownSelect';

describe('<DropDownSelect />', () => {
	let wrapper: any;
	const props: any = {
		selected: 0,
		items: ['0', '1', '2'],
		onChange: (fn: any) => fn
	};

	before(() => {
		wrapper = shallow(<DropDownSelect {...props}/>);
	});

	it('should have MenuItems from items', () => {
		props.items.forEach((item: string, i: number) => {
			expect(wrapper.find(MenuItem).at(i).props().value).to.equal(item);
		});
	});

	it('should have value from selected index', () => {
		props.items.forEach((item: string, i: number) => {
			props.selected = i;
			wrapper = shallow(<DropDownSelect {...props}/>);

			expect(wrapper.find(Select).props().value).to.equal(item);
		});
	});

	it('should have value from selected string', () => {
		props.items.forEach((item: string) => {
			props.selected = item;
			wrapper = shallow(<DropDownSelect {...props}/>);

			expect(wrapper.find(Select).props().value).to.equal(item);
		});
	});
});
