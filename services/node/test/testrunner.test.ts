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

import mongooseTests = require('./db-tests/mongoose-models-test-suite');
import dbConnectionTests = require('./db-tests/db-connection-test-suite');
import dbHandlerTests = require('./db-tests/db-handler-test-suite');
import emailHandlerTests = require('./email-tests/email-handler-test-suite');
import xoauthTests = require('./email-tests/xoauth-generator-test-suite');
import ImapConnectionTests = require('./email-tests/imap-connection-test-suite');
import mailRecieverTests = require('./email-tests/mail-reciever-test-suite');
import mailSenderTests = require('./email-tests/mail-sender-test-suite');

// Runs
mongooseTests.run();
dbConnectionTests.run();
dbHandlerTests.run();
// answerInteractorTests.run();
xoauthTests.run();
mailRecieverTests.run();
ImapConnectionTests.run();
mailSenderTests.run();
emailHandlerTests.run();
