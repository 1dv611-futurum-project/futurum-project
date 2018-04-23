import * as mocha from 'mocha';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from 'material-ui';
import { Modal } from '../../../src/components/Modal/Modal';

describe('<Modal />', () => {
	let wrapper: any;
	const props = {
		title: 'title',
		message: 'message',
		agree: 'agree',
		disagree: 'disagree',
		onChange: (fn: any) => fn,
	};

	before(() => {
		wrapper = shallow(<Modal {...props}/>);
	});

	it('should have a dialog title', () => {
		const expected = props.title;
		expect(wrapper.find(DialogTitle).props().children).to.equal(expected);
	});

	it('should have a dialog message', () => {
		const expected = props.message;
		expect(wrapper.find(DialogContentText).props().children).to.equal(expected);
	});

	it('should have an agree & disagree button', () => {
		const expectedAgree = props.agree;
		const expectedDisagree = props.disagree;
		const buttons = wrapper.find(Button);

		buttons.forEach((button: any, i: number) => {
			const buttonText = buttons.at(i).props().children;

			if (buttonText === props.agree) {
				expect(buttonText).to.equal(expectedAgree);
			} else {
				expect(buttonText).to.equal(expectedDisagree);
			}
		});
	});

	it('should do agree', () => {
		const agreeButton = wrapper.find(Button).at(1);
		props.onChange = (value: boolean) => {
			expect(value).to.equal(true);
		};
		wrapper = shallow(<Modal {...props}/>);

		agreeButton.simulate('click');
	});

	it('should not have disagree button if not provided', () => {
		const expected = 1;
		delete props.disagree;
		wrapper = shallow(<Modal {...props}/>);

		expect(wrapper.find(Button)).to.have.length(expected);
	});
});
