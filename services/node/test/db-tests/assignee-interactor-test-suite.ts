import {expect } from 'chai';
import { it, describe, before, after } from 'mocha';

import AssigneeInteractor from './../../src/handlers/db/tools/AssigneeInteractor';

/**
 * Run the tests.
 */
export function run() {
  describe('AssigneeInteractor', () => {

    describe('addOrUpdate', () => {

      it('should create a new assignee of the given info', (done) => {
        let assigneeInteractor = new AssigneeInteractor();
        assigneeInteractor.validate((err) => {
          expect().to.exist;
          done();
        });
      });

    });

  });
}
