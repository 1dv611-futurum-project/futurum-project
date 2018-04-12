/**
 * Test suite for the mongoose models.
 */

// Requires
let expect = require('chai').expect
let sinon = require('sinon')
let mongoose = require('mongoose')
let correctConnectionString = 'mongodb://futurum-db:27017'
let incorrectConnectionString = 'mongodb://futurum-db:27018'

import Connection from './../../src/handlers/db/DBConnection'
let sut = new Connection()

// Tests
describe('DBConnection', () => {
  describe('connect()', () => {
    describe('called with correct db-string', () => {
      let spy = sinon.spy()

      before(() => {
        return new Promise((resolve) => {
          sut.on('ready', spy)
          sut.on('ready', resolve)
          sut.connect(correctConnectionString)
        })
      })

      after(() => {
        return new Promise((resolve) => {
          mongoose.connection.close(resolve)
          sut.removeListener('ready', spy)
          sut.removeListener('ready', resolve)
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
          sut.on('connection-error', resolve)
          sut.on('connection-error', spy)
          sut.connect(incorrectConnectionString)
        })
      })

      after(() => {
        return new Promise((resolve) => {
          mongoose.connection.close(resolve)
          sut.removeListener('connection-error', spy)
          sut.removeListener('connection-error', resolve)
        })
      })

      it('should emit \'connection-error\'-event on no valid database-connection', (done) => {
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
          sut.on('ready', testDisconnect)
          sut.on('close', spy)
          sut.on('close', resolve)
          sut.connect(correctConnectionString)
        })
      })

      after(() => {
        return new Promise((resolve) => {
          sut.removeListener('ready', testDisconnect)
          sut.removeListener('close', resolve)
          sut.removeListener('close', spy)

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
          sut.on('close', spy)
          sut.on('close', resolve)

          if (mongoose.connection.readyState === 0) {
            sut.disconnectDB()
          } else {
            mongoose.connection.close(MongoDBHandler.disconnectDB)
          }
        })
      })

      after(() => {
        return new Promise((resolve) => {
          sut.removeListener('close', resolve)
          sut.removeListener('close', spy)

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
})

// Helper functions
function testDisconnect() {
  return sut.disconnectDB()
}
