/**
 * Runs all test-suites.
 */

// Variables
import { expect } from 'chai';
import { it, describe, before, after } from 'mocha';

// Test the Testrunner
describe('Testrunner', () => {
  it('should return pass on 1 + 1 equals 2', (done) => {
    expect(1 + 1).to.equal(2);
    done();
  });
});

// Suites
import mongooseTests = require('./db-tests/mongoose-models-test-suite');
import dbConnectionTests = require('./db-tests/db-connection-test-suite');
import dbHandlerTests = require('./db-tests/db-handler-test-suite');
import emailHandlerTests = require('./email-tests/email-handler-test-suite');
import xoauthTests = require('./email-tests/xoauth-generator-test-suite');
import ImapConnectionTests = require('./email-tests/imap-connection-test-suite');
import ImapHandlerTests = require('./email-tests/imap-handler-test-suite');

// Runs
mongooseTests.run();
dbConnectionTests.run();
dbHandlerTests.run();
xoauthTests.run();
ImapHandlerTests.run();
ImapHandlerTests.run();
emailHandlerTests.run();
