import * as mocha from 'mocha';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { Link } from 'react-router';
import { Paper, Menu, MenuItem, Divider } from 'material-ui';
import { Header } from '../../src/components/Header/Header';

let wrapper: any;

before(() => {
	wrapper = shallow(<Header/>);
});

describe('<Header />', () => {
	let wrapper: any;

	before(() => {
		wrapper = shallow(<Header/>);
	});

	it('should have a Paper', () => {
		expect(wrapper.find(Paper)).to.have.length(1);
	});

	it('should have style-property for Paper', () => {
		expect(wrapper.find(Paper).props()).to.include.all.keys('style');
	});

	it('should have a Menu', () => {
		expect(wrapper.find(Menu)).to.have.length(1);
	});

	it('should have 6 MenuItems', () => {
		expect(wrapper.find(MenuItem)).to.have.length(6);
	});

	it('should have 6 Links', () => {
		expect(wrapper.find(Link)).to.have.length(6);
	});

	it('should have Link to clients list', () => {
		expect(wrapper.find('Link[to="/clients"]')).to.have.length(1);
	});

	it('should have Link to settings', () => {
		expect(wrapper.find('Link[to="/settings"]')).to.have.length(1);
	});
});
