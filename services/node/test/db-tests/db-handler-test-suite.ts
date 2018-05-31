/**
 * Test suite for the mongoose models.
 */

// Requires
import { expect } from 'chai';
import { it, describe, before, after } from 'mocha';
import * as sinon from 'sinon';
import * as mongoose from 'mongoose';

import DBHandler from './../../src/handlers/db/DBHandler';
import DBConnection from './../../src/handlers/db/DBConnection';
import Ticket from './../../src/handlers/db/models/Ticket';
import Customer from './../../src/handlers/db/models/Customer';
import Assignee from './../../src/handlers/db/models/Assignee';

const DBConnectionInstance = new DBConnection();
const sut = new DBHandler(DBConnectionInstance);
const correctConnectionString = 'mongodb://futurum-db:27017';
let idMock;
let ticketIdMock;
const dateMock = Date.now();
let ticket = new Ticket({
	replyId: [],
	status: 0,
	isRead: false,
	body: [{received: dateMock, body: 'code more tests'}],
	mailId: 43212,
	created: dateMock,
	title: 'Best solutions',
	assignee: 'Anton',
});

// Catch expected connection error to allow the tests to continue.
sut.on('error', () => { console.log(''); });

/**
 * Run the tests.
 */
export function run() {
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

		describe('createNewFromType() ticket', () => {
			it('should store new instance of Ticket in database', () => {
				return new Promise((resolve) => {
					sut.addOrUpdate('ticket', ticket)
						.then((saved) => {
							if (Array.isArray(saved)) {
								idMock = saved[0]._id;
								ticketIdMock = saved[0].ticketId;
								ticket['_id'] = idMock;
								ticket['ticketId'] = ticketIdMock;
								ticket['__v'] = 0;
								expect(JSON.stringify(saved[0])).to.equal(JSON.stringify(ticket));
							} else {
								idMock = saved._id;
								ticketIdMock = saved.ticketId;
								ticket['_id'] = idMock;
								ticket['ticketId'] = ticketIdMock;
								ticket['__v'] = 0;
								expect(JSON.stringify(saved)).to.equal(JSON.stringify(ticket));
							}
							resolve();
						})
						.catch((err) => {
							console.error(err);
						});
				});
			});
		});

		describe('getOne() ticket', () => {
			it('should return one object of specific type', () => {
				return new Promise((resolve) => {
					sut.getOne('ticket', {_id: idMock})
						.then( (result) => {
							if (Array.isArray(result)) {
								expect(JSON.stringify(result[0]._id)).to.equal(JSON.stringify(idMock));
							} else {
								expect(JSON.stringify(result._id)).to.equal(JSON.stringify(idMock));
							}
							resolve();
						})
						.catch((err) => {
							console.error(err);
						});
				});
			});
		});

		describe('addOrUpdate() ticket', () => {
			it('should update ticket instance in the database', () => {
				return new Promise((resolve) => {
					ticket.status = 2;
					sut.addOrUpdate('ticket', ticket, {_id: idMock}).then((result) => {
						sut.getOne('ticket', {_id: idMock})
							.then((t) => {
								expect(t.status).to.equal(ticket.status);
								resolve();
							})
							.catch((err) => {
								console.log(err);
							});
					});
				});
			});
		});

		describe('removeOne() ticket', () => {
			it('should remove ticket instance added in sut', () => {
				return new Promise((resolve) => {
					sut.removeOne('ticket', {_id: idMock}).then((removed) => {
						sut.getOne('ticket', {_id: idMock})
						.then( (result) => {
							expect(result).to.equal(null);
							resolve();
						})
						.catch((err) => {
							console.log(err);
						});
					})
					.catch((err) => {
						console.error(err);
					});
				});
			});
		});

	});
}
