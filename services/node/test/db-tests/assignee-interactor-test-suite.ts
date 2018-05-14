import {expect  } from 'chai';
import { to, should, rejectedWith, instanceOf, property, eventually, be, and, an, have } from 'chai-as-promised';
import { it, describe, before, after } from 'mocha';
import * as sinon from 'sinon';
import * as mongoose from 'mongoose';

import AssigneeInteractor from './../../src/handlers/db/tools/AssigneeInteractor';
import IAssignee from './../../src/handlers/db/interfaces/IAssignee';
import DBHandler from './../../src/handlers/db/DBHandler';
import DBConnection from './../../src/handlers/db/DBConnection';
import { DBError, DBCreationError, DBConnectionError } from './../../src/config/errors';

const DBConnectionInstance = new DBConnection();
const sut = new DBHandler(DBConnectionInstance);
const correctConnectionString = 'mongodb://futurum-db:27017';

let assigneeInteractor = new AssigneeInteractor();
let assigneeId;

/**
 * Run the tests.
 */
export function run() {
  describe('AnswerInteractor', () => {
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

    describe('addOrUpdate', () => {
      it('should create a new assignee of the given info.', (done) => {
        const expected = getAssignee();
        assigneeInteractor.addOrUpdate(expected, expected).then((result) => {
          let res;
          if (!Array.isArray(result)) {
            assigneeId = result[0]._id;
            res = result[0];
          } else if (result !== null) {
            assigneeId = result._id;
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
      it('should find sut assignee in database.', (done) => {
        let assignee = getAssignee();
        assignee._id = assigneeId;
        assigneeInteractor.getOne(assignee).then((result) => {
          expect(JSON.stringify(result)).to.equal(JSON.stringify(assignee));
          done();
        });
        done();
      });
    });

    describe('removeOne', () => {
      it('should remove sut assignee from database.', (done) => {
        assigneeInteractor.removeOne({ _id: assigneeId }).then(() => {
          done();
        });
        done();
      });
    });

    describe('getOne', () => {
      it('should not find sut assignee in database.', (done) => {
        let assignee = getAssignee();
        assignee._id = assigneeId;
        assigneeInteractor.getOne(assignee).then((result) => {
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
function getAssignee(): any {
  return {
    email: 'completelyNewEmailAdr123@mail.com',
    name: 'completelyNewCustomerName123'
  } as IAssignee;
}
