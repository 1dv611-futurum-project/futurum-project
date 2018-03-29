import * as express from 'express';
import { Application, Router, Request, Response, NextFunction, Error } from 'express';
import * as bodyParser from 'body-parser';

class App {
  public express: Application;

  constructor() {
    this.express = express();
    this.middleware();
    this.mountRoutes();
  }

  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(this.errorHandler);
  }

  private mountRoutes(): void {
    this.express.get('/', this.route);
    this.express.all('*', this.emptyHandler);
  }

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

  private errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
    res.status(500).send({
      success: false,
      message: err.stack
    });
  }
}

export default new App().express;
