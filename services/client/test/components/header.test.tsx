import * as mocha from 'mocha';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { Link } from 'react-router';
import { Paper, Menu, MenuItem, Divider } from 'material-ui';
import { Header } from '../../src/components/Header/Header';

describe('<Header />', () => {
	it('should have a paper', () => {
		const wrapper = shallow(<Header />);
		expect(wrapper.find(Paper)).to.have.length(1);
	});

	it('should have a menu', () => {
		const wrapper = shallow(<Header />);
		expect(wrapper.find(Menu)).to.have.length(1);
	});

	it('should have menuitems', () => {
		const wrapper = shallow(<Header />);
		expect(wrapper.find(MenuItem)).to.have.length(6);
	});

	it('should have links', () => {
		const wrapper = shallow(<Header />);
		expect(wrapper.find(Link)).to.have.length(6);
	});

	it('should have link to clients list', () => {
		const wrapper = shallow(<Header />);
		expect(wrapper.find('Link[to="/clients"]')).to.have.length(1);
	});

	it('should have link to settings', () => {
		const wrapper = shallow(<Header />);
		expect(wrapper.find('Link[to="/settings"]')).to.have.length(1);
	});
});
