/**
 * Test suite for the Email interface.
 */

// Requires
import { expect } from 'chai';
import { it, describe, before, after } from 'mocha';
import EmailHandler from './../../src/handlers/email/EmailHandler';
import * as events from 'events';

const mockDB  = {getAll: () => new Promise((resolve, reject) => {resolve([{email: 'address'}]); })};
const sut = new EmailHandler(mockDB);

/**
 * Run the tests.
 */
export function run() {
	describe('EmailHandler', () => {
		it('should return an Outgoing handler that is an EventEmitter', (done) => {
			expect(sut.Outgoing).to.not.equal(null);
			expect(sut.Outgoing instanceof events.EventEmitter).to.equal(true);
			done();
		});

		it('should return an Incoming handler that is an EventEmitter', (done) => {
			expect(sut.Incoming).to.not.equal(null);
			expect(sut.Incoming instanceof events.EventEmitter).to.equal(true);
			done();
		});
	});
}
