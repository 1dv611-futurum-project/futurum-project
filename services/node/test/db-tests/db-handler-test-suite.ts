/**
 * Test suite for the mongoose models.
 */

// Requires
let expect = require('chai').expect
let sinon = require('sinon')
let mongoose = require('mongoose')
let correctConnectionString = 'mongodb://futurum-db:27017'
let incorrectConnectionString = 'mongodb://futurum-db:27018'

import DBHandler from './../../src/handlers/db/DBHandler'
let sut = new DBHandler()

// Tests
describe('DBHandler', () => {
  describe('addCustomer()', () => {
    let correctCustomerInfo = {name: 'Othman El Kabir', email: 'othman@dif.se'}
    let incorrectCustomerInfo = {notName: 'Othman El Kabir'}

    before(() => {
      return new Promise((resolve) => {
        sut.on('ready', resolve)
        sut.connect(correctConnectionString)
      })
    })

    after(() => {
      return new Promise((resolve) => {
        sut.removeListener('ready', resolve)
        sut.removeCustomer(correctCustomerInfo)
        resolve()
      })
    })

    describe('correct add', () => {
      it('should add the customer to the database', (done) => {
          sut.addCustomer(correctCustomerInfo)
            .then(() => {
              return sut.getCustomers(correctCustomerInfo)
            })
            .then((customers) => {
              console.log(customers)
              expect(customers[0]).to.exist
              expect(customers[0].name).to.equal(correctCustomerInfo.name)
              expect(customers[0].email).to.equal(correctCustomerInfo.email)
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

  describe('getCustomer()', () => {
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
