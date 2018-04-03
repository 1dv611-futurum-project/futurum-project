/**
 * Application starting point.
 */

// Imports.
import * as express from 'express';
import { Application, Router, Request, Response, NextFunction, Error } from 'express';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import mainRouter from './routes/mainRouter'
import IMAPConnection from './handlers/email/IMAPConnection';
import IMAPHandler from './handlers/email/IMAPHandler';

var GoogleStrategy = require('passport-google-oauth20').Strategy;

/**
 * Express app.
 */
class App {
  public express: Application;
  private mainRouter: Router;
  static PUBLIC_DIR = '/../../client/public';
  static RESOURCE_DIR = '/../../client/node_modules/';

  constructor() {
    this.express = express();
    this.mainRouter = mainRouter;
    this.middleware();
    this.mountRoutes();
    this.handleImap();
  }

  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(this.errorHandler);
    this.express.use(passport.initialize());
  }

  private mountRoutes(): void {
    this.express.use('/', this.mainRouter);
    this.express.all('*', this.emptyHandler);
  }

  private handleImap(): void {
    passport.use(new GoogleStrategy({
      clientID: process.env.IMAP_CLIENT_ID,
      clientSecret: process.env.IMAP_CLIENT_SECRET,
      callbackURL: 'http://127.0.0.1:8080/node/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('accessToken:')
      console.log(accessToken)
      console.log('refreshToken:')
      console.log(refreshToken)
      if (profile) {
        profile.accessToken = accessToken
        done(null, profile)
      } else {
        done({message: 'User did not allow delegation.'})
      }
    }
  ));
    /**IMAPHandler.connect(IMAPConnection);**/

    IMAPHandler.on('mail', (mail) => {
      console.log('Got mail:'); 
      console.log(mail); 
      console.log('Make call to database to save the mail.');
      console.log('Make call to ws to send notification of mail.');
    })

    IMAPHandler.on('message', (message) => {
      console.log('Got imap message, means imap connection is probably going to go down in a calculated way. Action?:'); 
      console.log(message)
      console.log('Make call to ws to send notification of message.')
    })

    IMAPHandler.on('tamper', (message) => {
      console.log('Got tamper message, means emails are being accesses externally and possible reload should happen:'); 
      console.log(message)
      console.log('Make call to ws to send notification of tamper.')
    })

    IMAPHandler.on('error', (error) => {
      console.log('Got error:'); 
      console.log(error)
      console.log('Make call to ws to send notification of error.')
      console.log('Possibly make call to email module to email the error to different email address.')
    })
  }

  // 404
  private emptyHandler(req: Request, res: Response, next: NextFunction): void {
    res.status(404).send({
      success: false,
      message: 'Not found'
    });
    return next();
  }

  // 500
  private errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
    res.status(500).send({
      success: false,
      message: err.stack
    });
  }
}

// Exports.
export default new App().express;
