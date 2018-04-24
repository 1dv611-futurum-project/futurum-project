/**
 * Test suite for the IMAPHandler-class.
 */

// Requires
import { expect } from 'chai';
import { it, describe, before, after } from 'mocha';
import * as events from 'events';
import IMAPHandler from './../../src/handlers/email/IMAPHandler';

/**
 * Run the tests.
 */
export function run() {
  describe('IMAPHandler', () => {
    before((done) => {
      // Do connect
      done();
    });

    describe('Emits', () => {
      // unauth message tamper error answer mail

      it('should be an EventEmitter', (done) => {
        expect(IMAPHandler instanceof events.EventEmitter).to.equal(true);
        done();
      });
    });
  });
}
