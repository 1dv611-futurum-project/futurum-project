/**
 * Test suite for the mongoose models.
 */

// Requires
let expect = require('chai').expect
let sinon = require('sinon')
let mongoose = require('mongoose')
let correctConnectionString = 'mongodb://futurum-db:27017'

import DBHandler from './../../src/handlers/db/DBHandler'
import DBConnection from './../../src/handlers/db/DBConnection'
let DBConnectionInstance = new DBConnection()
let sut = new DBHandler(DBConnectionInstance)
sut.on('error', () => {})

// Tests
describe('DBHandler', () => {
  after(() => {
    return new Promise((resolve) => {
      mongoose.connection.close(resolve)
    })
  })

  describe('connect()', () => {
    it('should connect the database', () => {
      return new Promise((resolve) => {
        sut.on('ready', resolve)
        let spy = sinon.spy(DBConnectionInstance, "connect")
        sut.connect(correctConnectionString)
        expect(spy.called).to.equal(true)
      })
    })
  })

  describe('addOrUpdate()', () => {
    let correctCustomerInfo = {name: 'Othman El Kabir', email: 'othman@dif.se'}
    let incorrectCustomerInfo = {notName: 'Othman El Kabir'}
    let correctType = 'customer'
    let incorrectType = 'notcustomer'

    describe('correct add of correct type', () => {
      it('should add the customer to the database if there  is no such customer already', (done) => {
          sut.addOrUpdate(correctType, correctCustomerInfo)
            .then(() => {
              return sut.getOne(correctType, correctCustomerInfo)
            })
            .then((customer) => {
              expect(customer).to.exist
              expect(customer.name).to.equal(correctCustomerInfo.name)
              expect(customer.email).to.equal(correctCustomerInfo.email)
              done()
            })
        })

      it ('should return the added customer', () => {
        
      })
    })

    describe('incorrect add', () => {
      it ('should reject with an error when name is missing', () => {

      })

      it ('should reject with an error when email is missing', () => {
        
      })
    })
  })

  describe('getAll()', () => {
    describe('customer exists', () => {
      it ('should return the customer when it matches all of the criteria', () => {

      })

      it ('should return the customer on partial criteria', () => {

      })
    })

    describe('customer does not exist', () => {
      it ('should reject', () => {

      })

      it ('should reject with an error message', () => {

      })
    })
  })

  describe('getOne()', () => {
    describe('customer exists', () => {
      it ('should return the customer when it matches all of the criteria', () => {

      })

      it ('should return the customer on partial criteria', () => {

      })
    })

    describe('customer does not exist', () => {
      it ('should reject', () => {

      })

      it ('should reject with an error message', () => {

      })
    })
  })

  describe('removeAll()', () => {
    describe('customer exists', () => {
      it ('should return the customer when it matches all of the criteria', () => {

      })

      it ('should return the customer on partial criteria', () => {

      })
    })

    describe('customer does not exist', () => {
      it ('should reject', () => {

      })

      it ('should reject with an error message', () => {

      })
    })
  })
})
