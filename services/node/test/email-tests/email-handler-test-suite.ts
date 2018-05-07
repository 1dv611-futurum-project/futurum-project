/**
 * Test suite for the Email interface.
 */

// Requires
import { expect } from 'chai';
import { it, describe, before, after } from 'mocha';
import * as sinon from 'sinon';
import EmailHandler from './../../src/handlers/email/EmailHandler';
import * as events from 'events';

// Helpers.
function getDBMock() {
  sinon.addBehavior('getAll', (customers, findBy) => {
    return new Promise((resolve, reject) => {
      resolve([{email: 'test@test.com'}]);
    });
  });

  const stub = sinon.stub();

  return stub;
}

const sut = new EmailHandler(getDBMock());

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
