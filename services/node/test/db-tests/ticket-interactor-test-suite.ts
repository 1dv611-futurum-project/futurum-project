import {expect  } from 'chai';
import { to, should, rejectedWith, instanceOf, property, eventually, be, and, an, have } from 'chai-as-promised';
import { it, describe, before, after } from 'mocha';
import * as sinon from 'sinon';
import * as mongoose from 'mongoose';

import TicketInteractor from './../../src/handlers/db/tools/TicketInteractor';
import ITicket from './../../src/handlers/db/interfaces/ITicket';
import DBHandler from './../../src/handlers/db/DBHandler';
import DBConnection from './../../src/handlers/db/DBConnection';
import { DBError, DBCreationError, DBConnectionError } from './../../src/config/errors';

const DBConnectionInstance = new DBConnection();
const sut = new DBHandler(DBConnectionInstance);
const correctConnectionString = 'mongodb://futurum-db:27017';

const ticketInteractor = new TicketInteractor();
let ticketId;

/**
 * Run the tests.
 */
export function run() {
  describe('TicketInteractor', () => {
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

    /**
     * SUT1, methods in TicketInteractor.
     * Seequence: (1) Add new (2) get the newly added (3) remove the newly added (4) fail to get removed newly added
     */
    describe('addOrUpdate', () => {
      it('should create a new ticket of the given info.', (done) => {
        const expected = getTicket();
        ticketInteractor.addOrUpdate(expected, expected).then((result) => {
          let res;
          if (!Array.isArray(result)) {
            ticketId = result[0]._id;
            res = result[0];
          } else if (result !== null) {
            ticketId = result._id;
            res = result;
          }
          expect(res.email).to.equal(expected.email);
          expect(res.name).to.equal(expected.name);
          done();
        });
        done();
      });
    });

    describe('getOne', () => {
      it('should find sut ticket in database.', (done) => {
        const ticket = getTicket();
        ticket._id = ticketId;
        ticketInteractor.getOne(ticket).then((result) => {
          expect(JSON.stringify(result)).to.equal(JSON.stringify(ticket));
          done();
        });
        done();
      });
    });

    describe('removeOne', () => {
      it('should remove sut ticket from database.', (done) => {
        ticketInteractor.removeOne({ _id: ticketId }).then(() => {
          done();
        });
        done();
      });
    });

    describe('getOne', () => {
      it('should not find sut ticket in database.', (done) => {
        const ticket = getTicket();
        ticket._id = ticketId;
        ticketInteractor.getOne(ticket).then((result) => {
          expect(result).to.be.null;
          done();
        });
        done();
      });
    });

    /**
     * SUT2, methods in TicketInteractor.
     */
  });
}

/**
 * Help functions
 */
function getTicket(): any {
  return {
    mailId: '3333',
    created: new Date(),
    isRead: false
  } as ITicket;
}

function updateTicketStatus(): any {
  const ticket = getTicket();
  ticket.status = 1;
  return ticket;
}

function updateTicketAssignee(): any {
  const ticket = getTicket();
  // ticket.assigne = Schema.Types.ObjectId, ref: 'Assignee'
  return ticket;
}
