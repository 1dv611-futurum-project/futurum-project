/**
 * Server starting point.
 */

/// <reference types="@types/node" />

// Imports.
import * as http from 'http';
import App from './App';
//import * as socketIo from 'socket.io';
//import { SocketIO, Server } from 'socket.io';
//import { server } from 'socket';
//import { Message } from './model';

//const socket = io.connect('http://localhost:3000/');
const port = process.env.PORT || 3000;
const server = http.createServer(App);

//let ioServer = socketIo(server);

// Start the server.
App.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  //new socket(server);

  return console.log(`Server is listening on ${port}`);
});

/*
class socket {
    
    private server: Server;
    private io: SocketIO.Server;
    private port = 3000;

    constructor(server) {
        console.log("asdasdasdasdassadasda");
        this.createServer(server);
        this.sockets();
        this.listen();
    }

    private createServer(server: any): void {
        this.server = server;
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen(): void {
        console.log("listen");
        this.io.on('connect', (socket: any) => {
            console.log('Connected client on port %s.', this.port);
            socket.on('message', (m: any) => {
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }

    
    public getApp(): express.Application {
        return this.app;
    }
    
}
*/




/* Message

import {User} from './user';

export class Message {
    constructor(private from: User, private content: string) {}
}

*/