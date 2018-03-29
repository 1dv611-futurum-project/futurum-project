/**
 * Server starting point.
 */

/// <reference types="@types/node" />

// Imports.
import * as http from 'http';
import App from './App';

const port = process.env.PORT || 3000
const server = http.createServer(App);

// Start the server.
App.listen(port, (err) => {
  if (err) {
    return console.log(err)
  }

  return console.log(`Server is listening on ${port}`)
})