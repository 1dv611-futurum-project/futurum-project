/**
 * Main router.
 */

 // Imports.
import * as express from 'express';
const mainRouter = express.Router();

// Routes.

mainRouter.get('/', (request: express.Request, response: express.Response): void => {
  response.status(200).json('Testrouter');
});

mainRouter.get('/connection', (request: express.Request, response: express.Response): void => {
  response.sendStatus(200);
});

// Exports.
export default mainRouter;
