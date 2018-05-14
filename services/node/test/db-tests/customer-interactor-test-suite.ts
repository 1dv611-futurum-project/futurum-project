import {expect  } from 'chai';
import { to, should, rejectedWith, instanceOf, property, eventually, be, and, an, have } from 'chai-as-promised';
import { it, describe, before, after } from 'mocha';
import * as sinon from 'sinon';
import * as mongoose from 'mongoose';

import CustomerInteractor from './../../src/handlers/db/tools/CustomerInteractor';
import ICustomer from './../../src/handlers/db/interfaces/ICustomer';
import DBHandler from './../../src/handlers/db/DBHandler';
import DBConnection from './../../src/handlers/db/DBConnection';
import { DBError, DBCreationError, DBConnectionError } from './../../src/config/errors';

const DBConnectionInstance = new DBConnection();
const sut = new DBHandler(DBConnectionInstance);
const correctConnectionString = 'mongodb://futurum-db:27017';

const customerInteractor = new CustomerInteractor();
let customerId;

/**
 * Run the tests.
 */
export function run() {
  describe('CustomerInteractor', () => {
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
     * SUT1, methods in CustomerInteractor.
     * Seequence: (1) Add new (2) get the newly added (3) remove the newly added (4) fail to get removed newly added
     */
    describe('addOrUpdate', () => {
      it('should create a new customer of the given info.', (done) => {
        const expected = getCompleteCustomer();
        customerInteractor.addOrUpdate(expected, expected).then((result) => {
          let res;
          if (!Array.isArray(result)) {
            customerId = result[0]._id;
            res = result[0];
          } else if (result !== null) {
            customerId = result._id;
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
      it('should find sut customer in database.', (done) => {
        const customer = getCompleteCustomer();
        customer._id = customerId;
        customerInteractor.getOne(customer).then((result) => {
          expect(JSON.stringify(result)).to.equal(JSON.stringify(customer));
          done();
        });
        done();
      });
    });

    describe('removeOne', () => {
      it('should remove sut customer from database.', (done) => {
        customerInteractor.removeOne({ _id: customerId }).then(() => {
          done();
        });
        done();
      });
    });

    describe('getOne', () => {
      it('should not find sut customer in database.', (done) => {
        const customer = getCompleteCustomer();
        customer._id = customerId;
        customerInteractor.getOne(customer).then((result) => {
          expect(result).to.be.null;
          done();
        });
        done();
      });
    });

    /**
     * SUT2, methods in CustomerInteractor.
     * Test with less complete customer missing optional attributes: errands and email.
     * Seequence: (1) Add new (2) get the newly added (3) remove the newly added (4) fail to get removed newly added
     */
    describe('addOrUpdate', () => {
      it('should create a new customer with name, without errands and email.', (done) => {
        const expected = getCustomer();
        customerInteractor.addOrUpdate(expected, expected).then((result) => {
          let res;
          if (!Array.isArray(result)) {
            customerId = result[0]._id;
            res = result[0];
          } else if (result !== null) {
            customerId = result._id;
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
      it('should find sut2 (lessCompleteNewCustomerOlle) customer in database.', (done) => {
        const customer = getCustomer();
        customer._id = customerId;
        customerInteractor.getOne(customer).then((result) => {
          expect(JSON.stringify(result)).to.equal(JSON.stringify(customer));
          done();
        });
        done();
      });
    });

    describe('removeOne', () => {
      it('should remove sut2 (lessCompleteNewCustomerOlle) customer from database.', (done) => {
        customerInteractor.removeOne({ _id: customerId }).then(() => {
          done();
        });
        done();
      });
    });

    describe('getOne', () => {
      it('should not find sut2 (lessCompleteNewCustomerOlle) customer in database.', (done) => {
        const customer = getCustomer();
        customer._id = customerId;
        customerInteractor.getOne(customer).then((result) => {
          expect(result).to.be.null;
          done();
        });
        done();
      });
    });

  });
}

/**
 * Help functions
 */
function getCompleteCustomer(): any {
  return {
    errands: 2,
    email: ['completelyNewEmailAdr123@mail.com', 'secondaryNewEmail@mail.com'],
    name: 'aNewCustomerOlle'
  } as ICustomer;
}

function getCustomer(): any {
  return {
    name: 'lessCompleteNewCustomerOlle'
  } as ICustomer;
}
