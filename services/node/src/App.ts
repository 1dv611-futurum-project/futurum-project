/**
 * Application starting point.
 */

// Imports.
import * as express from 'express';
import { Application, Router, Request, Response, NextFunction, Error } from 'express';
import * as bodyParser from 'body-parser';
import mainRouter from './routes/mainRouter'

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
    this.mainRouter = mainRouter
    this.middleware();
    this.mountRoutes();
  }

  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(this.errorHandler);
  }

  private mountRoutes(): void {
    this.express.use('/', this.mainRouter);
    this.express.all('*', this.emptyHandler);
  }

  // 404
  private route(req: Request, res: Response): void {
    res.status(200).json('Test');
  }

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
