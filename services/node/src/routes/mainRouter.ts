/**
 * Main router.
 */

 // Imports.
import * as express from 'express';
import * as passport from 'passport';
const mainRouter = express.Router();

// Routes.
mainRouter.get('/node', (request: express.Request, response: express.Response): void => {
  response.status(200).json('Testrouter');
});

mainRouter.get('/node/auth/google', passport.authenticate('google', { 
  scope: ['profile', 'https://mail.google.com/'], 
  accessType: 'offline', 
  prompt: 'consent'})
);

mainRouter.get('/node/auth/google/callback', passport.authenticate('google', { session: false }),(request: express.Request, response: express.Response): void => {
    console.log('godback')
  response.redirect('/');
  });

// Exports.
export default mainRouter;
