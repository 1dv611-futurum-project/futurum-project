/**
 * Test suite for the IMAPConnection-class.
 */

// Requires
import { expect } from 'chai';
import { it, describe, before, after } from 'mocha';
import * as events from 'events';
import Connection from './../../src/handlers/email/tools/IMAPConnection';

/**
 * Run the tests.
 */
export function run() {
  describe('IMAPConnection', () => {
    it('should implement the IMAPConnectionInterface', (done) => {
      expect(typeof Connection.updateCredentials).to.equal('function');
      expect(typeof Connection.getUnreadEmails).to.equal('function');
      expect(typeof Connection.listenForNewEmails).to.equal('function');
      expect(typeof Connection.closeConnection).to.equal('function');
      done();
    });

    it('should be an EventEmitter', (done) => {
      expect(Connection instanceof events.EventEmitter).to.equal(true);
      done();
    });
  });
}
