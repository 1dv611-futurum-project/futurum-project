import {expect  } from 'chai';
import { to, should, rejectedWith, instanceOf, property, eventually, be, and, an, have } from 'chai-as-promised';
import { it, describe, before, after } from 'mocha';
import * as sinon from 'sinon';
import * as mongoose from 'mongoose';

import AnswerInteractor from './../../src/handlers/db/tools/AnswerInteractor';
import IReceivedAnswer from './../../src/handlers/email/interfaces/IReceivedAnswer';
import DBHandler from './../../src/handlers/db/DBHandler';
import DBConnection from './../../src/handlers/db/DBConnection';
import { DBError, DBCreationError, DBConnectionError } from './../../src/config/errors';

const DBConnectionInstance = new DBConnection();
const sut = new DBHandler(DBConnectionInstance);
const correctConnectionString = 'mongodb://futurum-db:27017';

let answerInteractor = new AnswerInteractor();

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
      it('should throw database error', (done) => {
        answerInteractor.addOrUpdate(getAnswer(), null).then((result) => {
          console.log(result);
          expect(result).should.eventually
          .be.rejectedWith('Could not add answer to thread in database.')
          .and.be.an.instanceOf(DBCreationError)
          .and.have.property('code', 'EFOO');
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
function getAnswer(): any {
  return {
    mailId: 'rStr23',
    inAnswerTo: 'question',
    received: 'may14',
    body: 'A question about',
    fromName: 'Nils-Oskar'
  } as IReceivedAnswer;
}
