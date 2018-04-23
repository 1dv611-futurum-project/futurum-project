/**
 * Test suite for the IMAPHandler-class.
 */

// Requires
let expect = require('chai').expect;
import * as events from 'events';
import IMAPHandler from './../../src/handlers/email/IMAPHandler';

// Tests
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
