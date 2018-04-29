import * as mocha from 'mocha';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { TableBody, TableRow, TableCell, IconButton } from 'material-ui';
import { ClientList } from '../../../src/components/ClientList/ClientList';
import { ClientRow } from '../../../src/components/ClientList/ClientRow';

describe('<ClientList />', () => {
	let wrapper: any;
	let tableRow: any;
	let clientName: string;
	const props = {
		customers: [{name: 'test', email: 'test', errands: 0}],
		onEdit: (name: string) => { clientName = name; },
		onDelete: (name: string) => { clientName = name; }
	};

	before(() => {
		wrapper = shallow(<ClientList {...props}/>).find(TableBody);
		tableRow = wrapper.find(ClientRow).dive();
		clientName = '';
	});

	it('should have client name in a TableCell', () => {
		expect(tableRow.find(TableCell).at(0).props().children).to.equal(props.customers[0].name);
	});

	it('should have client email in a TableCell', () => {
		expect(tableRow.find(TableCell).at(1).props().children).to.equal(props.customers[0].email);
	});

	it('should have client errands in a TableCell', () => {
		expect(tableRow.find(TableCell).at(2).props().children).to.equal(props.customers[0].errands);
	});

	it('should get client from edit-button', () => {
		const expected = props.customers[0];

		tableRow.find(IconButton).at(0).simulate('click');
		expect(clientName).to.equal(expected);
	});

	it('should get client from delete-button', () => {
		const expected = props.customers[0];

		tableRow.find(IconButton).at(1).simulate('click');
		expect(clientName).to.equal(expected);
	});
});
