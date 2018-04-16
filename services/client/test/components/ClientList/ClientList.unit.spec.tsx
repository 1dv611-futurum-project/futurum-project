import * as mocha from 'mocha';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { TableBody, TableRow, TableCell, IconButton } from 'material-ui';
import { ClientList } from '../../../src/components/ClientList/ClientList';

describe('<ClientList />', () => {
	let wrapper: any;
	let tableRow: any;
	let clientName: string;
	const props = { 
		data: [{name: 'test', email: 'test', errands: 0}], 
		onEdit: (name: string) => { clientName = name; },
		onDelete: (name: string) => { clientName = name; }
	};

	before(() => {
		wrapper = shallow(<ClientList {...props}/>).find(TableBody);
		tableRow = wrapper.find(TableRow).at(0);
		clientName = '';
	});

	it('should have client name in a TableCell', () => {
		expect(tableRow.find(TableCell).at(0).props().children).to.equal(props.data[0].name);
	});

	it('should have client email in a TableCell', () => {
		expect(tableRow.find(TableCell).at(1).props().children).to.equal(props.data[0].email);
	});

	it('should have client errands in a TableCell', () => {
		expect(tableRow.find(TableCell).at(2).props().children).to.equal(props.data[0].errands);
	});

	it('should get client name from edit-button', () => {
		let expected = props.data[0].name;

		tableRow.find(IconButton).at(0).simulate('click');
		expect(clientName).to.equal(expected);
	});

	it('should get client name from delete-button', () => {
		let expected = props.data[0].name;

		tableRow.find(IconButton).at(1).simulate('click');
		expect(clientName).to.equal(expected);
	});
});
