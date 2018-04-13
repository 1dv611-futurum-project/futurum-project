/**
 * Authorization and authentication router.
 */

 // Imports.
import * as express from 'express';
import { Application, Router, Request, Response, NextFunction, Error } from 'express';
import * as passport from 'passport';
import IMAPConnection from './../handlers/email/IMAPConnection';
import IMAPHandler from './../handlers/email/IMAPHandler';
import * as jwt from 'jsonwebtoken';

const authRouter: Router = express.Router();

/**
 * Router class
 */
class AuthRouter {
  private authRouter: Router;

  constructor() {
    this.authRouter = authRouter;
    this.mountRoutes();
  }

  /**
   * Returns the router.
   */
  get Router(): Router {
    return this.authRouter;
  }

  /**
   * Mounts the routes.
   */
  private mountRoutes() {
    this.authRouter.get('/google', passport.authenticate('gmail', {
      scope: ['profile', 'email', 'https://mail.google.com/'],
      accessType: 'offline',
      prompt: 'consent'})
    );

    this.authRouter.get('/google/callback',
                        passport.authenticate('gmail', { session: false }),
                        this.redirectToUpdateIMAP);

    this.authRouter.get('/google/callback/redirect', this.redirectToClient);
  }

  /**
   * Redirects user to go thorug IMAP middleware.
   */
  private redirectToUpdateIMAP(request: express.Request, response: express.Response): void {
    response.redirect('/node/auth/google/callback/redirect');
  }

/**
 * Redirects the user back to the client app when authentication is done.
 */
  private redirectToClient(request: express.Request, response: express.Response): void {
    const signed = jwt.sign({
      data: 'logged in'
    }, 'secret');
    response.cookie('jwt', signed);
    response.redirect('/');
  }
}

// Exports.
export default new AuthRouter().Router;
