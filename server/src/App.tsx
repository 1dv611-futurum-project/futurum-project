import * as express from 'express';
import { Application, Router, Request, Response, NextFunction, Error } from 'express';
import * as path from "path";
import * as bodyParser from 'body-parser';

class App {

  public express: Application;
  static PUBLIC_DIR = '/../../client/public';
  static RESOURCE_DIR = '/../../client/node_modules/';

  constructor() {
    this.express = express();
    this.middleware();
    this.mountRoutes();
  }

  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(express.static(path.join(__dirname, App.PUBLIC_DIR)));
    this.express.use('/scripts', express.static(path.join(__dirname + App.RESOURCE_DIR)));
    this.express.use(this.errorHandler);
  }

  private mountRoutes(): void {
    this.express.get('/', this.route);
    this.express.all('*', this.emptyHandler);
  }

  private route(req: Request, res: Response): void {
    res.render("Test");
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