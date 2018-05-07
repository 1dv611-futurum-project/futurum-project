/**
 * Test suite for the IMAPHandler-class.
 */

// Requires
import { expect } from 'chai';
import { it, describe, before, after } from 'mocha';
import * as sinon from 'sinon';
import * as events from 'events';
import MailReciever from './../../src/handlers/email/tools/MailReciever';
import IMAPConnectionInterface from './../../src/handlers/email/interfaces/IMAPConnectionInterface';
import { IMAPError } from '../../src/config/errors';
import { IMAPConnectionEvent } from './../../src/handlers/email/events/IMAPConnectionEvents';
import { IncomingMailEvent } from './../../src/handlers/email/events/IncomingMailEvents';

const IMAPMailReciever = new MailReciever(getDBMock());

/**
 * Run the tests.
 */
export function run() {
  describe('MailReciever', () => {
    after((done) => {
      IMAPMailReciever.disconnect();
      done();
    });

    describe('connect()', () => {
      const ConnectionMock = getInterfaceMock();

      before((done) => {
        IMAPMailReciever.connect(sinon.stub(ConnectionMock));
        done();
      });

      it('should update the connection credentials', (done) => {
        expect(ConnectionMock.updateCredentials.called).to.equal(true);
        done();
      });

      it('should not call the getUnreadEmails function until ready-event has been emitted', (done) => {
        expect(ConnectionMock.getUnreadEmails.called).to.equal(false);
        done();
      });
    });

    describe('disconnect()', () => {
      const ConnectionMock = getInterfaceMock();

      before((done) => {
        IMAPMailReciever.connect(sinon.stub(ConnectionMock));
        done();
      });

      it('should disconnect', (done) => {
        IMAPMailReciever.disconnect();
        expect(ConnectionMock.closeConnection.called).to.equal(true);
        done();
      });
    });

    describe('Emits', () => {
      const EmitMock = getInterfaceMock();

      before((done) => {
        IMAPMailReciever.connect(EmitMock);
        done();
      });

      describe('TICKET', () => {
        let ticketSpy;
        const ticket = {
          from: {name: 'hi', address: 'test@test.com'},
          messageId: '4672',
          receivedDate: 'Today',
          subject: 'Hi',
          text: 'Hi'
        };

        before((done) => {
          ticketSpy = sinon.spy();
          IMAPMailReciever.on(IncomingMailEvent.TICKET, ticketSpy);
          EmitMock.emit(IMAPConnectionEvent.MAIL, ticket);
          setTimeout(done, 1500);
        });

        it('should emit ticket-event when alerted with a mail-event that does not have references-property', (done) => {
          expect(ticketSpy.called).to.equal(true);
          done();
        });

        it('should include ticket information in event', (done) => {
          expect((ticketSpy.getCall(0).args[0].title)).to.equal(ticket.subject);
          done();
        });
      });

      describe('ANSWER', () => {
        let answerSpy;
        const answer = {
          from: {name: 'hi', address: 'test@test.com'},
          references: '1234',
          messageId: '4672',
          receivedDate: 'Today',
          subject: 'Hi',
          html: '<div>Hi</div>',
        };

        before((done) => {
          answerSpy = sinon.spy();
          IMAPMailReciever.on(IncomingMailEvent.ANSWER, answerSpy);
          EmitMock.emit(IMAPConnectionEvent.MAIL, answer);
          setTimeout(done, 1000);
        });

        it('should emit answer-event when alerted with a mail-event that has references-property', (done) => {
          expect(answerSpy.called).to.equal(true);
          done();
        });

        it('should include answer information in event', (done) => {
          expect((answerSpy.getCall(0).args[0].inAnswerTo)).to.equal(answer.references);
          done();
        });
      });

      describe('ERROR', () => {
        let errorSpy;
        before((done) => {
          errorSpy = sinon.spy();
          IMAPMailReciever.on(IncomingMailEvent.ERROR, errorSpy);
          EmitMock.emit(IMAPConnectionEvent.ERROR, new Error());
          setTimeout(done, 1000);
        });

        it('should emit own error event on error event being emitted from the connection', (done) => {
          expect(errorSpy.called).to.equal(true);
          done();
        });

        it('should include error in event', (done) => {
          expect((errorSpy.getCall(0).args[0] instanceof Error)).to.equal(true);
          done();
        });

        it('should provide own error if no error was included in call', (done) => {
          EmitMock.emit(IMAPConnectionEvent.ERROR);
          expect((errorSpy.lastCall.args[0] instanceof IMAPError)).to.equal(true);
          done();
        });
      });

      describe('TAMPER', () => {
        let tamperSpy;
        before((done) => {
          tamperSpy = sinon.spy();
          IMAPMailReciever.on(IncomingMailEvent.TAMPER, tamperSpy);
          EmitMock.emit(IMAPConnectionEvent.CHANGE);
          setTimeout(done, 1000);
        });

        it('should emit tamper event om server change', (done) => {
          expect(tamperSpy.called).to.equal(true);
          done();
        });

        it('should not include payload in event if not provided', (done) => {
          expect((tamperSpy.getCall(0).args[0])).to.equal(undefined);
          done();
        });

        it('should include payload in event if provided', (done) => {
          const payload = {message: 'hi'};
          EmitMock.emit(IMAPConnectionEvent.CHANGE, payload);
          expect((tamperSpy.lastCall.args[0])).to.equal(payload);
          done();
        });
      });

      describe('UNAUTH', () => {
        let unauthSpy;
        before((done) => {
          unauthSpy = sinon.spy();
          IMAPMailReciever.on(IncomingMailEvent.UNAUTH, unauthSpy);
          EmitMock.emit(IMAPConnectionEvent.UNAUTH);
          setTimeout(done, 1000);
        });

        it('should emit unauth event on unauth event from connection', (done) => {
          expect(unauthSpy.called).to.equal(true);
          done();
        });

        it('should include payload with message', (done) => {
          const payloadMessage  = 'User credentails are missing.';
          EmitMock.emit(IMAPConnectionEvent.CHANGE);
          expect((unauthSpy.lastCall.args[0].message)).to.equal(payloadMessage);
          done();
        });
      });

      describe('MESSAGE', () => {
        let messageSpy;
        before((done) => {
          messageSpy = sinon.spy();
          IMAPMailReciever.on(IncomingMailEvent.MESSAGE, messageSpy);
          EmitMock.emit(IMAPConnectionEvent.SERVER);
          setTimeout(done, 1000);
        });

        it('should emit tamper event om server change', (done) => {
          expect(messageSpy.called).to.equal(true);
          done();
        });

        it('should not include payload in event if not provided', (done) => {
          expect((messageSpy.getCall(0).args[0])).to.equal(undefined);
          done();
        });

        it('should include payload in event if provided', (done) => {
          const payload = {message: 'hi'};
          EmitMock.emit(IMAPConnectionEvent.SERVER, payload);
          expect((messageSpy.lastCall.args[0])).to.equal(payload);
          done();
        });
      });
    });
  });
}

// Helpers.
function getInterfaceMock() {
  return new InterfaceMock();
}

// Helpers.
function getDBMock() {
  return {
    getAll: () => { return (new Promise((resolve, reject) => {
      resolve([{name: 'hi', email: ['test@test.com']}]);
    })); }
  };
}

// tslint:disable-next-line:max-classes-per-file
class InterfaceMock extends events.EventEmitter implements IMAPConnectionInterface {
  public updateCredentials() {
    console.log('');
  }

  public closeConnection() {
    console.log('');
  }

  public getUnreadEmails(): Promise<void> {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  public listenForNewEmails(): Promise<void> {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}
