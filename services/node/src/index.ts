/**
 * Server starting point.
 */

// Imports.
import * as http from 'http';
import App from './servers/App';

const serverport = process.env.PORT || 3000;
const socketport = process.env.SOCKET_PORT || 3001;

// Start the server.
App.listen(serverport, (err) => {
  if (err) {
    return console.error(err);
  }

  return console.log(`Server is listening on ${serverport}`);
});
