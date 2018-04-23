/**
 * Test suite for the mongoose models.
 */

// Requires
import {expect } from 'chai';
import { it, describe, before, after } from 'mocha';
import Customer from './../../src/models/Customer';

// Tests
describe('Mongoose Models', () => {
  describe('Customer', () => {
    it('should be invalid if name is empty', (done) => {
      const cust = new Customer({email: 'halla@halla.com'});

      cust.validate((err) => {
        expect(err.errors.name).to.exist;
        done();
      });
    });

    it('should be invalid if email is empty', (done) => {
      const cust = new Customer({name: 'halla@halla.com'});

      cust.validate((err) => {
        expect(err.errors.email).to.exist;
        done();
      });
    });
  });
});
