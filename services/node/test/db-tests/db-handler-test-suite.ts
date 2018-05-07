/**
 * Test suite for the mongoose models.
 */

// Requires
import { expect } from 'chai';
import { it, describe, before, after } from 'mocha';
import * as sinon from 'sinon';
import * as mongoose from 'mongoose';

import DBHandler from './../../src/handlers/db/DBHandler';
import DBConnection from './../../src/handlers/db/DBConnection';
import Ticket from './../../src/handlers/db/models/Ticket';

const DBConnectionInstance = new DBConnection();
const sut = new DBHandler(DBConnectionInstance);
const correctConnectionString = 'mongodb://futurum-db:27017';

// Catch expected connection error to allow the tests to continue.
sut.on('error', () => { console.log(''); });

/**
 * Run the tests.
 */
export function run() {
  describe('DBHandler', () => {
    after(() => {
      return new Promise((resolve) => {
        mongoose.connection.close(resolve);
      });
    });

    describe('connect()', () => {
      it('should connect the database', () => {
        return new Promise((resolve) => {
          sut.on('ready', resolve);
          const spy = sinon.spy(DBConnectionInstance, 'connect');
          sut.connect(correctConnectionString);
          expect(spy.called).to.equal(true);
        });
      });
    });

    describe('createNewFromType() ticket', () => {
      it('should store new instance of Ticket in database', () => {
        return new Promise((resolve) => {
          const expected = new Ticket({from: 'mock@mail.com', body: []});
          sut.createNewFromType('ticket', expected)
            .then((saved) => {
              expect(JSON.stringify(saved)).to.equal(JSON.stringify(expected));
            });
        });
      });
    });

    describe('getOne() ticket', () => {
      it('should return one object of specific type', () => {
        return new Promise((resolve) => {
          const expected = new Ticket({from: 'mock@mail.com', body: []});
          sut.getOne('ticket', expected).then( (ticket) => {
            expect(JSON.stringify(ticket)).to.equal(JSON.stringify(expected));
          });
        });
      });
    });

    describe('addOrUpdate() ticket', () => {
      it('should update ticket instance in the database', () => {
        return new Promise((resolve) => {
          const expected = new Ticket({title: 'Updated title', from: 'mock@mail.com', body: []});
          const oldTicket = new Ticket({from: 'mock@mail.com', body: []});
          sut.addOrUpdate('ticket', expected).then((ticket) => {
            sut.getOne('ticket', oldTicket).then((t) => {
              expect(JSON.stringify(t)).to.equal(JSON.stringify(expected));
            });
          });
        });
      });
    });

    describe('removeOne() ticket', () => {
      it('should remove ticket instance added in sut', () => {
        return new Promise((resolve) => {
          const removeOn = new Ticket({title: 'Updated title', from: 'mock@mail.com', body: []});
          sut.removeOne('ticket', removeOn);
          sut.getOne('ticket', removeOn).then( (ticket) => {
            expect(ticket).to.equal(null);
            // chai.should().equal(ticket, null);
            // expect(ticket).to.be.null;
          });
        });
      });
    });
  });
}
