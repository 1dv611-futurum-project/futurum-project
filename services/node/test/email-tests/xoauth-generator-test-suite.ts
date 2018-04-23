/**
 * Test suite for the xoauth-class.
 */

// Requires
import { expect } from 'chai';
import { it, describe, before, after } from 'mocha';
import XOauthGen from './../../src/handlers/email/Xoauth2Generator';

// Tests
describe('XOauth2Generator', () => {
  before((done) => {
    removeCredentials();
    done();
  });

  after((done) => {
    removeCredentials();
    done();
  });

  it('should reject if there are no credentials', () => {
    return new Promise((resolve) => {
      XOauthGen.getToken()
      .catch((err) => {
        expect(err).to.equal('No generator');
        resolve();
      });
    });
  });

  it('should return a Promise that resolves with an accessToken', () => {
    return new Promise((resolve) => {
      setCredentials();
      XOauthGen.getToken()
      .then((token) => {
        expect(token).to.not.equal(null);
        resolve();
      });
    });
  });

  it('should update credentials automatically', () => {
    return new Promise((resolve) => {
      let firstToken;
      let secondToken;

      XOauthGen.getToken()
      .then((token) => {
        expect(token).to.not.equal(null);
        firstToken = token;
        return Promise.resolve();
      })
      .then(() => {
        changeCredentials();
        return XOauthGen.getToken();
      })
      .then((token) => {
        expect(token).to.not.equal(null);
        secondToken = token;
        expect(secondToken).to.not.equal(firstToken);
        resolve();
      });
    });
  });
});

function setCredentials() {
  process.env.IMAP_USER = 'test@test.com';
  process.env.IMAP_CLIENT_ID = 'testID';
  process.env.IMAP_CLIENT_SECRET = 'testSecret';
  process.env.IMAP_ACCESS_TOKEN = 'testAccess';
  process.env.IMAP_REFRESH_TOKEN = 'testRefresh';
}

function changeCredentials() {
  process.env.IMAP_USER = 'test@test.com';
  process.env.IMAP_CLIENT_ID = 'testID';
  process.env.IMAP_CLIENT_SECRET = 'testSecret';
  process.env.IMAP_ACCESS_TOKEN = 'newTestAccess';
  process.env.IMAP_REFRESH_TOKEN = 'testRefresh';
}

function removeCredentials() {
  delete process.env.IMAP_USER;
  delete process.env.IMAP_CLIENT_ID;
  delete process.env.IMAP_CLIENT_SECRET;
  delete process.env.IMAP_ACCESS_TOKEN;
  delete process.env.IMAP_REFRESH_TOKEN;
}
