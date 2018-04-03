/**
 * Server starting point.
 */

/// <reference types="@types/node" />

// Imports.
import * as http from 'http';
import App from './App';

const port = process.env.PORT || 3000;
const server = http.createServer(App);

//  Catch exit-events to allow for listening on process.exit for cleanup.
process.on('SIGINT', process.exit());
process.on('SIGUSR1', process.exit());
process.on('SIGUSR2', process.exit());
process.on('uncaughtException', process.exit());


// Start the server.
App.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }

  return console.log(`Server is listening on ${port}`);
});
