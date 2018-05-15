import {expect  } from 'chai';
import { to, should, rejectedWith, instanceOf, property, eventually, be, and, an, have } from 'chai-as-promised';
import { it, describe, before, after } from 'mocha';

import AnswerInteractor from './../../src/handlers/db/tools/AnswerInteractor';
import IReceivedAnswer from './../../src/handlers/email/interfaces/IReceivedAnswer';
import { DBError, DBCreationError, DBConnectionError } from './../../src/config/errors';

const sut = new AnswerInteractor();

/**
 * Run the tests.
 */
export function run() {
  describe('AnswerInteractor', () => {
    describe('addOrUpdate', () => {
      it('should throw database error', (done) => {
        return new Promise((resolve) => {
          sut.addOrUpdate(getAnswer(), resolve).then((result) => {
            expect(result).should.eventually
            .be.rejectedWith('Could not add answer to thread in database.')
            .and.be.an.instanceOf(DBCreationError);
          });
        });
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
