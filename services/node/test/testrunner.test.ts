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
import answerInteractorTests = require('./db-tests/answer-interactor-test-suite');
import assigneeInteractorTests = require('./db-tests/assignee-interactor-test-suite');
import customerInteractorTests = require('./db-tests/customer-interactor-test-suite');
import ticketInteractorTests = require('./db-tests/ticket-interactor-test-suite');

import mongooseTests = require('./db-tests/mongoose-models-test-suite');
import dbConnectionTests = require('./db-tests/db-connection-test-suite');
import dbHandlerTests = require('./db-tests/db-handler-test-suite');
import emailHandlerTests = require('./email-tests/email-handler-test-suite');
import xoauthTests = require('./email-tests/xoauth-generator-test-suite');
import ImapConnectionTests = require('./email-tests/imap-connection-test-suite');
import ImapHandlerTests = require('./email-tests/imap-handler-test-suite');
import mailSenderTests = require('./email-tests/mail-sender-test-suite');

// Runs
answerInteractorTests.run();
/*
mongooseTests.run();
dbConnectionTests.run();
dbHandlerTests.run();

xoauthTests.run();
ImapHandlerTests.run();
ImapConnectionTests.run();
mailSenderTests.run();
emailHandlerTests.run();
*/