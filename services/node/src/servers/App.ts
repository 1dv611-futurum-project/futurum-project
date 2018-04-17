/**
 * Application starting point.
 */

// Imports.
import * as express from 'express';
import { Application, Router, Request, Response, NextFunction, Error } from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as jwt from 'express-jwt'; 
import middleware from './../config/middleware';
import passportStrategies from "./../config/passport";
import mainRouter from './../routes/mainRouter';
import authRouter from './../routes/authRouter';
import DBHandler from './../handlers/db/DBHandler';
import DBConnection from './../handlers/db/DBConnection';
import EmailHandler from './../handlers/email/EmailHandler';
import WebsocketHandler from './../handlers/WebsocketHandler';

/**
 * Express app.
 */
class App {
  public express: Application;
  private mainRouter: Router;
  private authRouter: Router;
  private DBHandler: DBHandler;
  private websocketHandler: WebsocketHandler;

  constructor() {
    this.express = express();
    this.mainRouter = mainRouter;
    this.authRouter = authRouter;
    this.DBHandler = new DBHandler(new DBConnection());
    this.middleware();
    this.mountRoutes();
    this.handleIncomingEmails();
    this.handleDB();
  }

  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(cookieParser());
    passportStrategies.make();
    this.express.use(middleware.security());
    this.express.use(middleware.checkConnection());
    this.express.use(middleware.updateIMAPConnection());
    this.express.use(this.errorHandler);
  }

  private mountRoutes(): void {
    this.express.use('/', this.mainRouter);
    this.express.use('/node', this.mainRouter);
    this.express.use('/node/auth', this.authRouter);
    this.express.use('/auth', this.authRouter);
    this.express.all('*', this.emptyHandler);
  }

  private handleDB(): void {
    this.DBHandler.on('ready', () => {
      console.log('Connected to db');
    });

    this.DBHandler.on('error', (error) => {
      console.log('Error in db'); 
      console.log(error);
    });

    this.DBHandler.on('disconnected', () => {
      console.log('db disconnected'); 
    });

    this.DBHandler.connect('mongodb://futurum-db:27017');
  }

  private handleIncomingEmails(): void {
    EmailHandler.Incoming.on('mail', (mail) => {
      console.log('Got mail:'); 
      console.log(mail); 
      
      console.log('Make call to database to save the mail.');
      this.websocketHandler.emit(mail);
    })

    EmailHandler.Incoming.on('unauth', (payload) => {
      console.log('Got unauth:'); 
      console.log(payload)
      console.log('We are missing authorization details for the email, should direct user to auth-route?.');
    })

    EmailHandler.Incoming.on('message', (message) => {
      console.log('Got imap message, means imap connection is probably going to go down in a calculated way. Action?:'); 
      console.log(message)
      console.log('Make call to ws to send notification of message.')
    })

    EmailHandler.Incoming.on('tamper', (message) => {
      console.log('Got tamper message, means emails are being accesses externally and possible reload should happen:'); 
      console.log(message)
      console.log('Make call to ws to send notification of tamper.')
    })

    EmailHandler.Incoming.on('error', (error) => {
      console.log('Got error:'); 
      console.log(error)
      console.log('Make call to ws to send notification of error.')
      console.log('Possibly make call to email module to email the error to different email address:')
      EmailHandler.sendMail({to: 'dev@futurumdigital.se', subject: 'error', body: 'Error'})
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
  private errorHandler(err, req: Request, res: Response, next: NextFunction): void {
    if (err.name === 'UnauthorizedError') {
      return res.redirect('/node/auth/google');
    } 
    
    res.status(500).send({
      success: false,
      message: err.stack
    });
  }
}

// Exports.
export default new App().express;
