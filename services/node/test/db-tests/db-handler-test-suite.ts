/**
 * Test suite for the mongoose models.
 */

// Requires
import { expect } from 'chai';
import { it, describe, before, after } from 'mocha';
import * as sinon from 'sinon';
import * as mongoose from 'mongoose';
const correctConnectionString = 'mongodb://futurum-db:27017';

import DBHandler from './../../src/handlers/db/DBHandler';
import DBConnection from './../../src/handlers/db/DBConnection';
const DBConnectionInstance = new DBConnection();
const sut = new DBHandler(DBConnectionInstance);
sut.on('error', () => { console.log('Expected error.'); });

// Tests
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
});
