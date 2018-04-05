/**
 * Main router.
 */

 // Imports.
import * as express from 'express';
import * as passport from 'passport';
import IMAPConnection from './../handlers/email/IMAPConnection';
import IMAPHandler from './../handlers/email/IMAPHandler';
const mainRouter = express.Router();

// Routes.

mainRouter.get('/node', (request: express.Request, response: express.Response): void => {
  response.status(200).json('Testrouter');
});

/**
 * Lets the user authenticate and delegate access to the support email.
 */
mainRouter.get('/node/auth/google', passport.authenticate('gmail', {
  scope: ['profile', 'email', 'https://mail.google.com/'],
  accessType: 'offline',
  prompt: 'consent'})
);

/**
 * Reloads the page to update the IMAP-connection by redirecting the user.
 */
mainRouter.get('/node/auth/google/callback',
 passport.authenticate('gmail', { session: false }), (request: express.Request, response: express.Response): void => {
   response.redirect('/node/auth/google/callback/redirect');
 });

/**
 * Redirects the user back to the client app when authentication is done.
 */
mainRouter.get('/node/auth/google/callback/redirect', (request: express.Request, response: express.Response): void => {
  response.redirect('/');
});

// Exports.
export default mainRouter;
