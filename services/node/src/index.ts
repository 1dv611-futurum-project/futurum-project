/**
 * Server starting point.
 */

/// <reference types="@types/node" />

// Imports.
import * as http from 'http';
import App from './App';
import * as socketIo from 'socket.io';
import { server } from 'socket';

const port = process.env.PORT || 3000;
const serv = http.createServer(App);

// Start the server.
App.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }

  return console.log(`Server is listening on ${port}`);
});


let io = socketIo(serv);

io.on('connect', (socket) => {
	console.log('socket connected!');
	socket.emit('started server!');

	socket.on('message', (m) => {
		console.log(m);
		socket.emit('message: ' + m);
	});

	socket.on('disconnect', () => {
		console.log('disconnected');
	});
});
//var io = require('socket.io')();
// socket.on('connection', function(client){});
// socket.listen(3000);
//
// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
//
// async function demo() {
//   console.log('Taking a break...');
//   await sleep(2000);
//   console.log('Two second later');
// }
//
// demo();
//
// socket.sendUTF("TESTAR SOCKETIO");




/*
//var wsServer = new WebSocketServer({
  var wsServer = new server({
    httpServer: serv,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
  });
  var jsonwsserver = JSON.stringify(wsServer);
  console.log("jsonwsserver   "+jsonwsserver);
  console.log("wsServer:   "+wsServer.httpServer);

  function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
  }

  wsServer.on('request', function(request) {
    console.log("wsServer.on");
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
  });

  console.log("jsonwsserver   "+jsonwsserver);

  */
