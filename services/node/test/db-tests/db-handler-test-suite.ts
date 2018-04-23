/**
 * Test suite for the mongoose models.
 */

// Requires
let expect = require('chai').expect;
let sinon = require('sinon');
let mongoose = require('mongoose');
let correctConnectionString = 'mongodb://futurum-db:27017';

import DBHandler from './../../src/handlers/db/DBHandler';
import DBConnection from './../../src/handlers/db/DBConnection';
let DBConnectionInstance = new DBConnection();
let sut = new DBHandler(DBConnectionInstance);
sut.on('error', () => {});

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
