/**
 * Test suite for the IMAPHandler-class.
 */

// Requires
import { expect } from 'chai';
import { it, describe, before, after } from 'mocha';
import * as sinon from 'sinon';
import * as events from 'events';
import MailSender from './../../src/handlers/email/MailSender';
import IMAPConnectionInterface from './../../src/handlers/email/interfaces/IMAPConnectionInterface';
import { IMAPError } from '../../src/config/errors';
import { IMAPConnectionEvent } from './../../src/handlers/email/events/IMAPConnectionEvents';
import { IncomingMailEvent } from './../../src/handlers/email/events/IncomingMailEvents';

/**
 * Run the tests.
 */
export function run() {
  describe('MailSender', () => {
    const sendEmailStub = sinon.stub(MailSender, 'sendMail');

    describe('send()', () => {

      const email = {
        from: 'send@gmail.com',
        to: 'sendto@gmail.com',
        subject: 'subject',
        body: 'body'
      };

      before((done) => {
        sendEmailStub.returns(new Promise((resolve, reject) => {resolve(); }));
        done();
      });

      it('should return a promise', (done) => {
        expect(MailSender.send(email) instanceof Promise).to.equal(true);
        done();
      });

      describe('headers', () => {
        before((done) => {
          MailSender.send(email);
          done();
        });

        it('should contain a from-header that is correct', (done) => {
          const from = sendEmailStub.lastCall.args[0].find((header) => {
            return header.indexOf('From') !== -1;
          });
          expect(from.indexOf(email.from) > -1).to.equal(true);
          done();
        });

        it('should contain a to-header that is correct', (done) => {
          const to = sendEmailStub.lastCall.args[0].find((header) => {
            return header.indexOf('To') !== -1;
          });
          expect(to.indexOf(email.to) > -1).to.equal(true);
          done();
        });

        it('should have encoded the subject', (done) => {
          const subject = sendEmailStub.lastCall.args[0].find((header) => {
            return header.indexOf('Subject') !== -1;
          });
          expect(subject.indexOf(email.subject) > -1).to.equal(false);
          expect(subject.indexOf('=?utf-8?B?') > -1).to.equal(true);
          done();
        });

        it('should have the body last', (done) => {
          const bodyIndex = sendEmailStub.lastCall.args[0].findIndex((header) => {
            return header.indexOf(email.body) !== -1;
          });
          expect(bodyIndex).to.equal(sendEmailStub.lastCall.args[0].length - 1);
          done();
        });

        it('should have an empty string at index before the body', (done) => {
          const bodyIndex = sendEmailStub.lastCall.args[0].findIndex((header) => {
            return header.indexOf(email.body) !== -1;
          });
          expect(sendEmailStub.lastCall.args[0][bodyIndex - 1]).to.equal('');
          done();
        });
      });
    });

    describe('answer()', () => {

      const email = {
        from: 'send@gmail.com',
        to: 'sendto@gmail.com',
        subject: 'subject',
        body: 'body'
      };

      const messageIDToAnswer = '33333';

      before((done) => {
        sendEmailStub.returns(new Promise((resolve, reject) => {resolve(); }));
        done();
      });

      it('should return a promise', (done) => {
        expect(MailSender.answer(email, messageIDToAnswer) instanceof Promise).to.equal(true);
        done();
      });

      describe('headers', () => {
        before((done) => {
          MailSender.answer(email, messageIDToAnswer);
          done();
        });

        it('should contain a from-header that is correct', (done) => {
          const from = sendEmailStub.lastCall.args[0].find((header) => {
            return header.indexOf('From') !== -1;
          });
          expect(from.indexOf(email.from) > -1).to.equal(true);
          done();
        });

        it('should contain a to-header that is correct', (done) => {
          const to = sendEmailStub.lastCall.args[0].find((header) => {
            return header.indexOf('To') !== -1;
          });
          expect(to.indexOf(email.to) > -1).to.equal(true);
          done();
        });

        it('should contain a In-reply-to-header that has the message-id given', (done) => {
          const inreply = sendEmailStub.lastCall.args[0].find((header) => {
            return header.indexOf('In-Reply-To') !== -1;
          });
          expect(inreply.indexOf(messageIDToAnswer) > -1).to.equal(true);
          done();
        });

        it('should have added Re: to the subject', (done) => {
          const subject = sendEmailStub.lastCall.args[0].find((header) => {
            return header.indexOf('Subject') !== -1;
          });
          expect(subject.indexOf('Re:') > -1).to.equal(true);
          done();
        });

        it('should have encoded the subject', (done) => {
          const subject = sendEmailStub.lastCall.args[0].find((header) => {
            return header.indexOf('Subject') !== -1;
          });
          expect(subject.indexOf(email.subject) > -1).to.equal(false);
          expect(subject.indexOf('=?utf-8?B?') > -1).to.equal(true);
          done();
        });

        it('should have the body last', (done) => {
          const bodyIndex = sendEmailStub.lastCall.args[0].findIndex((header) => {
            return header.indexOf(email.body) !== -1;
          });
          expect(bodyIndex).to.equal(sendEmailStub.lastCall.args[0].length - 1);
          done();
        });

        it('should have an empty string at index before the body', (done) => {
          const bodyIndex = sendEmailStub.lastCall.args[0].findIndex((header) => {
            return header.indexOf(email.body) !== -1;
          });
          expect(sendEmailStub.lastCall.args[0][bodyIndex - 1]).to.equal('');
          done();
        });
      });
    });

    describe('forward()', () => {

      const messageToForward = {
        from: 'send@gmail.com',
        to: 'sendto@gmail.com',
        subject: 'subject',
        body: 'body'
      };

      const messageIDToForward = '2222';

      const forwardingAddress = 'forward@forward.com';

      before((done) => {
        sendEmailStub.returns(new Promise((resolve, reject) => {resolve(); }));
        done();
      });

      it('should return a promise', (done) => {
        const result = MailSender.forward(messageToForward, messageIDToForward, forwardingAddress);
        expect(result instanceof Promise).to.equal(true);
        done();
      });

      describe('headers', () => {
        before((done) => {
          MailSender.forward(messageToForward, messageIDToForward, forwardingAddress);
          done();
        });

        it('should contain a from-header that is correct', (done) => {
          const from = sendEmailStub.lastCall.args[0].find((header) => {
            return header.indexOf('From') !== -1;
          });
          expect(from.indexOf(messageToForward.from) > -1).to.equal(true);
          done();
        });

        it('should contain a to-header that has the forwarding address', (done) => {
          const to = sendEmailStub.lastCall.args[0].find((header) => {
            return header.indexOf('To') !== -1;
          });
          expect(to.indexOf(forwardingAddress) > -1).to.equal(true);
          done();
        });

        it('should contain a messageID-header that has the message-id given', (done) => {
          const messageID = sendEmailStub.lastCall.args[0].find((header) => {
            return header.indexOf('Message-ID') !== -1;
          });
          expect(messageID.indexOf(messageIDToForward) > -1).to.equal(true);
          done();
        });

        it('should contain a Reply-To-header that has the from-address given', (done) => {
          const replyTo = sendEmailStub.lastCall.args[0].find((header) => {
            return header.indexOf('Reply-To') !== -1;
          });
          expect(replyTo.indexOf(messageToForward.from) > -1).to.equal(true);
          done();
        });

        it('should have added Vbf: to the subject', (done) => {
          const subject = sendEmailStub.lastCall.args[0].find((header) => {
            return header.indexOf('Subject') !== -1;
          });
          expect(subject.indexOf('Vbf:') > -1).to.equal(true);
          done();
        });

        it('should have encoded the subject', (done) => {
          const subject = sendEmailStub.lastCall.args[0].find((header) => {
            return header.indexOf('Subject') !== -1;
          });
          expect(subject.indexOf(messageToForward.subject) > -1).to.equal(false);
          expect(subject.indexOf('=?utf-8?B?') > -1).to.equal(true);
          done();
        });

        it('should have the body last', (done) => {
          const bodyIndex = sendEmailStub.lastCall.args[0].findIndex((header) => {
            return header.indexOf(messageToForward.body) !== -1;
          });
          expect(bodyIndex).to.equal(sendEmailStub.lastCall.args[0].length - 1);
          done();
        });

        it('should have an empty string at index before the body', (done) => {
          const bodyIndex = sendEmailStub.lastCall.args[0].findIndex((header) => {
            return header.indexOf(messageToForward.body) !== -1;
          });
          expect(sendEmailStub.lastCall.args[0][bodyIndex - 1]).to.equal('');
          done();
        });
      });
    });
  });
}
