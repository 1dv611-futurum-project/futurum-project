/**
 * Main router.
 */

 // Imports.
import * as express from 'express';
import { Application, Router, Request, Response, NextFunction, Error } from 'express';

const mainRouter = express.Router();

/**
 * Router class
 */
class MainRouter {
  private mainRouter: Router;

  constructor() {
    this.mainRouter = mainRouter;
    this.mountRoutes();
  }

  /**
   * Returns the router.
   */
  get Router(): Router {
    return this.mainRouter;
  }

  /**
   * Mounts the routes.
   */
  private mountRoutes(): void {
    this.mainRouter.get('/connection', this.connectionRoute);
  }

  /**
   * Target route for checking the connection status to the IMAP server.
   */
  private connectionRoute(request: express.Request, response: express.Response): void {
    response.sendStatus(200);
  }
}

// Exports.
export default new MainRouter().Router;
