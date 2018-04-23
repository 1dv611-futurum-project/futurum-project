/**
 * Test suite for the Email interface.
 */

// Requires
import { expect } from 'chai';
import { it, describe, before, after } from 'mocha';
import EmailHandler from './../../src/handlers/email/EmailHandler';
import * as events from 'events';

// Tests
describe('EmailHandler', () => {
  it('should return an Outgoing handler that is an EventEmitter', (done) => {
    expect(EmailHandler.Outgoing).to.not.equal(null);
    expect(EmailHandler.Outgoing instanceof events.EventEmitter).to.equal(true);
    done();
  });

  it('should return an Incoming handler that is an EventEmitter', (done) => {
    expect(EmailHandler.Incoming).to.not.equal(null);
    expect(EmailHandler.Incoming instanceof events.EventEmitter).to.equal(true);
    done();
  });
});
