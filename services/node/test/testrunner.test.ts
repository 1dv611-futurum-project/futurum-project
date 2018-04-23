/**
 * Requires all test-suites.
 */

// Variables
let expect = require('chai').expect

describe('testrunner', () => {
  it('should return pass on 1 + 1 equals 2', (done) => {
    expect(1 + 1).to.equal(2)
    done()
  })
})

// Suites
require('./db-tests/mongoose-models-test-suite')
require('./db-tests/db-connection-test-suite')
require('./db-tests/db-handler-test-suite')
require('./email-tests/email-handler-test-suite')
