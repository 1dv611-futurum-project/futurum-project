import * as mocha from 'mocha';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { SnackbarNotice } from '../../../src/components/SnackbarNotice/SnackbarNotice';
import { Snackbar, IconButton } from 'material-ui';

describe('<SnackbarNotice />', () => {
	let wrapper: any;
	let snackbar: any;
	const props = {
		message: 'message',
		open: true,
		onClose: (fn: any) => fn
	};

	before(() => {
		wrapper = shallow(<SnackbarNotice {...props}/>);
		snackbar = wrapper.find(Snackbar).dive();
	});

	it('should have a message', () => {
		const expected = props.message;
		expect(snackbar.find('#snackbar__message').text()).to.equal(expected);
	});

	it('should close on button click', () => {
		const closeButton = wrapper.find(IconButton).at(0);

		closeButton.simulate('click');
		expect(wrapper.state('open')).to.equal(false);
	});
});
