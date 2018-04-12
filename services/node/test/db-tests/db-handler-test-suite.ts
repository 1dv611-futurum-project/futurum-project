/**
 * Test suite for the mongoose models.
 */

// Requires
let expect = require('chai').expect
let sinon = require('sinon')
let mongoose = require('mongoose')
let correctConnectionString = 'mongodb://futurum-db:27017/test-db'
let incorrectConnectionString = 'mongodb://futurum-db:27018/test-db'

import MongoDBHandler from './../../src/handlers/MongoDBHandler'

// Tests
describe('MongoDBHandler', () => {
  describe('connect()', () => {
    describe('called with correct db-string', () => {
      let spy = sinon.spy()

      before(() => {
        return new Promise((resolve) => {
          MongoDBHandler.on('ready', spy)
          MongoDBHandler.on('ready', resolve)
          MongoDBHandler.connect(correctConnectionString)
        })
      })

      after(() => {
        return new Promise((resolve) => {
          MongoDBHandler.disconnect()
          resolve()
        })
      })

      it('should emit \'ready\'-event on open', () => {
        expect(spy.called).to.equal(true)
      })
    })

    describe('called with incorrect db-string', () => {
      let spy = sinon.spy()

      before(() => {
        return new Promise((resolve) => {
          MongoDBHandler.on('error', spy)
          MongoDBHandler.on('error', resolve)
          MongoDBHandler.connect(incorrectConnectionString)
        })
      })

      after(() => {
        return new Promise((resolve) => {
          MongoDBHandler.on('close', resolve)
          MongoDBHandler.disconnect()
        })
      })

      it('should emit \'error\'-event on no valid database-connection', (done) => {
        expect(spy.called).to.equal(true)
        done()
      })
  
      it('should pass the error on when emitting \'error\'-event', (done) => {
        expect(spy.calledWith(undefined)).to.equal(false)
        expect(spy.calledWith(null)).to.equal(false)
        expect(spy.calledWith(sinon.match({}))).to.equal(true)
        done()
      })
    })
  })

  describe('disconnect()', () => {
    describe('called when connected', () => {
      let spy = sinon.spy()
  
      before(() => {
        return new Promise((resolve) => {
          MongoDBHandler.on('ready', MongoDBHandler.disconnect)
          MongoDBHandler.on('close', spy)
          MongoDBHandler.on('close', resolve)
          MongoDBHandler.connect(correctConnectionString)
        })
      })

      after(() => {
        return new Promise((resolve) => {
          if (mongoose.connection.readyState === 0) {
            resolve()
          } else {
            mongoose.connection.close(resolve)
          }
        })
      })

      it('should emit close-event', (done) => {
        expect(spy.called).to.equal(true)
        done()
      })

      it('should disconnect the database', (done) => {
          expect(mongoose.connection.readyState).to.equal(0)
          done()
      })
    })

    describe('called when disconnected', () => {
      let spy = sinon.spy()
  
      before(() => {
        return new Promise((resolve) => {
          MongoDBHandler.on('close', spy)
          MongoDBHandler.on('close', resolve)

          if (mongoose.connection.readyState === 0) {
            MongoDBHandler.disconnect()
          } else {
            mongoose.connection.close(MongoDBHandler.disconnect)
          }
        })
      })

      after(() => {
        return new Promise((resolve) => {
          if (mongoose.connection.readyState === 0) {
            resolve()
          } else {
            mongoose.connection.close(resolve)
          }
        })
      })

      it('should emit close-event', (done) => {
        expect(spy.called).to.equal(true)
        done()
      })

      it('should keep the database disconnected', (done) => {
          expect(mongoose.connection.readyState).to.equal(0)
          done()
      })
    })
  })

  describe('addCustomer()', () => {
    before(() => {
      return new Promise((resolve) => {
        MongoDBHandler.on('ready', resolve)
        MongoDBHandler.connect(correctConnectionString)
      })
    })

    after(() => {
      return new Promise((resolve) => {
        if (mongoose.connection.readyState === 0) {
          resolve()
        } else {
          mongoose.connection.close(resolve)
        }
      })
    })

    describe('correct add', () => {
      it ('should add the customer to the database', () => {

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
