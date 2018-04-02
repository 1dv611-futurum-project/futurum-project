/**
 * Main router.
 */

 // Imports.
import * as express from 'express';
const mainRouter = express.Router();

// Routes.
mainRouter.get('/node', (request: express.Request, response: express.Response): void => {
  response.status(200).json('Testrouter');
});

// Exports.
export default mainRouter;
