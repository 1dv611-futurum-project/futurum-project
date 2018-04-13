import * as mocha from 'mocha';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { Link } from 'react-router';
import { Paper, Menu, MenuItem, Divider } from 'material-ui';
import { Header } from '../../src/components/Header/Header';

describe('<Header />', () => {
	let wrapper: any;

	before(() => {
		wrapper = shallow(<Header/>);
	});

	it('should have a Paper', () => {
		expect(wrapper.find(Paper)).to.have.length(1);
	});

	it('should have a Menu', () => {
		expect(wrapper.find(Menu)).to.have.length(1);
	});

	it('should have Links', () => {
		expect(wrapper.find(Link)).to.have.length(6);
	});

	it('should have Link to clients list', () => {
		expect(wrapper.find('Link[to="/clients"]')).to.have.length(1);
	});

	it('should have Link to settings', () => {
		expect(wrapper.find('Link[to="/settings"]')).to.have.length(1);
	});
});
