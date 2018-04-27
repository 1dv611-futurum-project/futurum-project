/**
 * Authorization and authentication router.
 */
import * as express from 'express';
import { Application, Router, Request, Response, NextFunction, Error } from 'express';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import { AuthError } from './../config/errors';

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
    this.authRouter.get('/google', this.passportAuth({
      scope: ['profile', 'email', 'https://mail.google.com/'],
      accessType: 'offline',
      prompt: 'consent'})
    );

    this.authRouter.get('/google/callback',
                        this.passportAuth({ session: false }),
                        this.redirectToUpdateIMAP);

    this.authRouter.get('/google/callback/redirect', this.redirectToClient);
  }

  private passportAuth(opts: object): ((req: Request, res: Response, next: NextFunction) => void) {
    return (req: Request, res: Response, next: NextFunction): void => {
      passport.authenticate('gmail', opts, (err, user, info) => {
        if (err) {
          return next(err);
        }

        if (!user) {
          return next(new AuthError('Failed to authorize or authenticate user.'));
        }

        return next();
      })(req, res, next);
    };
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
    }, 'secret', {
      expiresIn : '1h'
    });
    response.cookie('jwt', signed);
    response.redirect('/');
  }
}

// Exports.
export default new AuthRouter().Router;
