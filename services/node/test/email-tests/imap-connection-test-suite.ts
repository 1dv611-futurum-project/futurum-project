/**
 * Test suite for the xoauth-class.
 */

// Requires
let expect = require('chai').expect;
import IMAPConnectionInterface from './../../src/handlers/email/IMAPConnectionInterface';
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
});
