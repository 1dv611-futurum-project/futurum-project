/**
 * Main router.
 */

 // Imports.
import * as express from 'express';
let mainRouter = express.Router()

// Routes.
mainRouter.get('/node', (request: express.Request, response: express.Response): void => {
    response.status(200).json("TestRouter");
});

// Exports.
export default mainRouter;
