import * as express from 'express';
import { Application, Request, Response, NextFunction, Error } from 'express';
import * as path from "path";
import * as bodyParser from 'body-parser';

class App {

  public express: Application;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(express.static(path.join(__dirname, '/../../client/public')));
    this.express.use('/scripts', express.static(path.join(__dirname + '/../../node_modules/')));
    this.express.use(this.serverError);
  }

  private routes(): void {
    let router = express.Router();
    router.get('/', this.site);

    this.express.use('/', router);
    this.express.all('*', this.notFound);
  }

  private site(req: Request, res: Response, next: NextFunction) {
    res.json('Funkar');
  }

  private notFound(req: Request, res: Response, next: NextFunction) {
    res.status(404).send({
      success: false,
      message: 'Not found'
    });
    return next();
  }

  private serverError(err: Error, req: Request, res: Response, next: NextFunction) {
    res.status(500).send({
      success: false,
      message: err.stack
    });
  }
}

export default new App().express;