/**
 * Authorization and authentication router.
 */

 // Imports.
 import * as express from 'express';
 import * as passport from 'passport';
 import * as jwt from 'jsonwebtoken';

 const authRouter = express.Router();
 
 // Routes.

 /**
  * Lets the user authenticate and delegate access to the support email.
  */
 authRouter.get('/google', passport.authenticate('gmail', {
   scope: ['profile', 'email', 'https://mail.google.com/'],
   accessType: 'offline',
   prompt: 'consent'})
 );
 
 /**
  * Reloads the page to update the IMAP-connection by redirecting the user.
  */
 authRouter.get('/google/callback',
  passport.authenticate('gmail', { session: false }), (request: express.Request, response: express.Response): void => {
    response.redirect('/node/auth/google/callback/redirect');
  });
 
 /**
  * Redirects the user back to the client app when authentication is done.
  */
 authRouter.get('/google/callback/redirect', (request: express.Request, response: express.Response): void => {
  const signed = jwt.sign({
    data: 'logged in'
  }, 'secret');
   response.cookie('jwt', signed);
   response.redirect('/');
 });
 
 // Exports.
 export default authRouter;
 