/**
 * Test suite for the mongoose models.
 */

// Requires
let expect = require('chai').expect
import Customer from './../../src/models/Customer'

// Tests
describe('Mongoose Models', () => {
  describe('Customer', () => {
    it('should be invalid if name is empty', (done) => {
      let cust = new Customer()

      cust.validate((err) => {
          expect(err.errors.name).to.exist
          done()
      })
    })
  })
})
