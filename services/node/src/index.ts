/**
 * Server starting point.
 */

/// <reference types="@types/node" />

// Imports.
import * as http from 'http';
import App from './App';
const port = process.env.PORT || 3000;
const io = require('socket.io')({ path: '/socket' });

// Start the server.
App.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }

  return console.log(`Server is listening on ${port}`);
});

io.listen(3001);
io.on('connection', (socket) => {
	console.log('server connected');
	io.to(socket.id).emit('socket', { id: socket.id });
});
