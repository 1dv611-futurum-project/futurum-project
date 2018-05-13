import {expect } from 'chai';
import { it, describe, before, after } from 'mocha';

import AnswerInteractor from './../../src/handlers/db/tools/AnswerInteractor';

/**
 * Run the tests.
 */
export function run() {
  describe('AnswerInteractor', () => {

    describe('addOrUpdate', () => {

      it('should throw database error', (done) => {
        let answerInteractor = new AnswerInteractor();
        answerInteractor.validate((err) => {
          expect().to.exist;
          done();
        });
      });

    });

  });
}
