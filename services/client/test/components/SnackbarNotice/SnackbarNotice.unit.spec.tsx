import * as mocha from 'mocha';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { Snackbar, IconButton } from 'material-ui';
import { SnackbarNotice } from '../../../src/components/SnackbarNotice/SnackbarNotice';

describe('<SnackbarNotice />', () => {
	let wrapper: any;
	const props = {
		message: 'message',
		open: false,
		onClose: (fn: any) => fn
	};

	before(() => {
		wrapper = shallow(<SnackbarNotice {...props}/>);
	});

	it('should have a message', () => {
		const expected = props.message;
		expect(wrapper.find('.snackbar__message').at(0).text()).to.equal(expected);
	});

	it('should close on button click', () => {
		const closeButton = wrapper.find(IconButton).at(0);
		closeButton.simulate('click');
		expect(wrapper.state('open')).to.equal(false);
	});
});
