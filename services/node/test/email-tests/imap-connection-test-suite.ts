/**
 * Test suite for the IMAPConnection-class.
 */

// Requires
let expect = require('chai').expect;
import * as events from 'events';
import IMAPConnection from './../../src/handlers/email/IMAPConnection';

// Tests
describe('IMAPConnection', () => {
  it('should implement the IMAPConnectionInterface', (done) => {
    expect(typeof IMAPConnection.updateCredentials).to.equal('function');
    expect(typeof IMAPConnection.getUnreadEmails).to.equal('function');
    expect(typeof IMAPConnection.listenForNewEmails).to.equal('function');
    expect(typeof IMAPConnection.closeConnection).to.equal('function');
    done();
  });

  it('should be an EventEmitter', (done) => {
    expect(IMAPConnection instanceof events.EventEmitter).to.equal(true);
    done();
  });
});
