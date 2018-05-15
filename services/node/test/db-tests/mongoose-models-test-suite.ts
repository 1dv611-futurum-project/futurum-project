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
			it('should be invalid if name is empty', (done) => {
				const cust = new Customer({email: 'halla@halla.com'});

				cust.validate((err) => {
					// tslint:disable-next-line:no-unused-expression
					expect(err.errors.name).to.exist;
					done();
				});
			});

			it('should be invalid if email is empty', (done) => {
				const cust = new Customer({name: 'halla@halla.com'});

				cust.validate((err) => {
					// tslint:disable-next-line:no-unused-expression
					expect(err.errors.email).to.exist;
					done();
				});
			});
		});

		describe('Ticket', () => {
			it('should be invalid if from is not set', (done) => {
				const ticket = new Ticket({
					status: 0,
					assignee: 'Johan Söderlund',
					title: 'Best solutions',
					customerName: 'Johan Söderlund',
					body: [{received: Date.now(), fromCustomer: true, body: 'code more tests'}]
				});

				ticket.validate((err) => {
					// tslint:disable-next-line:no-unused-expression
					expect(err.errors.ticket.from).to.exist;
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
				const cust = new Customer({name: 'halla@halla.com'});

				cust.validate((err) => {
					// tslint:disable-next-line:no-unused-expression
					expect(err.errors.email).to.exist;
					done();
				});
			});
		});
	});
}
