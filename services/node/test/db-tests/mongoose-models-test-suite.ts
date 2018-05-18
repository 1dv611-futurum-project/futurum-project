/**
 * Test suite for the mongoose models.
 */

// Requires
import {expect } from 'chai';
import { it, describe, before, after } from 'mocha';
import Customer from './../../src/handlers/db/models/Customer';
import Ticket from './../../src/handlers/db/models/Ticket';
import Assignee from './../../src/handlers/db/models/Assignee';

/**
 * Run the tests.
 */
export function run() {
	describe('Mongoose Models', () => {
		describe('Customer', () => {
			it('should be valid if email is present', (done) => {
				const cust = new Customer({email: ['halla@halla.com']});
				cust.validate((err) => {
					// tslint:disable-next-line:no-unused-expression
					expect(err).to.be.null;
					done();
				});
			});

			it('should be invalid if email is empty', (done) => {
				const cust = new Customer({name: 'DR.Steve Stensson'});
				// expect(cust).to.equal(undefined);

				cust.validate((err) => {
					// tslint:disable-next-line:no-unused-expression
					expect(err).to.not.equal(null);
					done();
				});
			});
		});

		describe('Ticket', () => {
			it('should be invalid if mailId is not set', (done) => {
				const ticket = new Ticket({
					status: 0,
					assignee: 'Anton',
					title: 'Best solutions',
					customerName: 'MS.Stensson',
					created: Date.now(),
					isRead: false,
					body: [{received: Date.now(), fromCustomer: true, body: 'code more tests'}]
				});

				ticket.validate((err) => {
					// tslint:disable-next-line:no-unused-expression
					expect(err.errors.mailId).to.exist;
					done();
				});
			});

			it('should be when correct customer reference is present', (done) => {
				const cust = new Customer({email: ['halla@halla.com']});
				const ticket = new Ticket({
					mailId: '1234',
					from: cust._id,
					created: Date.now(),
					isRead: false
				});

				ticket.validate((err) => {
					// tslint:disable-next-line:no-unused-expression
					expect(err).to.be.null;
					done();
				});
			});

			it('should be when correct assignee reference is present', (done) => {
				const assignee = new Assignee({email: 'halla@halla.com', name: 'Sebastian'});
				const ticket = new Ticket({
					mailId: '1235',
					assignee: assignee._id,
					created: Date.now(),
					isRead: false
				});

				ticket.validate((err) => {
					// tslint:disable-next-line:no-unused-expression
					expect(err).to.be.null;
					done();
				});
			});
		});

		describe('Assignee', () => {
			it('should be invalid if name is empty', (done) => {
				const assignee = new Assignee({email: 'halla@halla.com'});

				assignee.validate((err) => {
					// tslint:disable-next-line:no-unused-expression
					expect(err.errors.name).to.exist;
					done();
				});
			});

			it('should be invalid if email is empty', (done) => {
				const cust = new Assignee({name: 'halla@halla.com'});

				cust.validate((err) => {
					// tslint:disable-next-line:no-unused-expression
					expect(err.errors.email).to.exist;
					done();
				});
			});
		});
	});
}
