/**
 * Test suite for the mongoose models.
 */

// Requires
import {expect } from 'chai';
import { it, describe, before, after } from 'mocha';
import Customer from './../../src/handlers/db/models/Customer';

/**
 * Run the tests.
 */
export function run() {
  describe('Mongoose Models', () => {
    describe('Customer', () => {
      it('should be valid if name is empty', (done) => {
        const cust = new Customer({email: 'halla@halla.com'});
        cust.validate((err) => {
          // tslint:disable-next-line:no-unused-expression
          expect(err).to.not.exist;
          done();
        });
      });

      it('should be set email to default array if not given', (done) => {
        const cust = new Customer({name: 'halla@halla.com'});
        cust.validate((err) => {
          // tslint:disable-next-line:no-unused-expression
          expect(cust.email).to.exist;
          expect(Array.isArray(cust.email)).to.equal(true);
          done();
        });
      });
    });
  });
}
