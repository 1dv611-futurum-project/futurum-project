/**
 * Handles the websocket connection against the client.
 */

// Imports.
import * as socketIo from 'socket.io';
import { SocketIO, Server, Socket } from 'socket.io';
import Ticket from './../models/Ticket';


class WebsocketHandler {

    private server: Server;
    private io: Socket;
    private port = 3000;
    
    constructor(server: any) {
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

    private originIsAllowed(origin): boolean {
        // put logic here to detect whether the specified origin is allowed.
        return true;
    }

    public emit(data: Array<Object>): void{
        try {
            if (this.socket.status) {
                this.io.emit(JSON.stringify(data));
            }
        } catch (error) {
            console.error(error);
        }
    }

}

// Exports.
export default WebsocketHandler;





/*

class WebsocketServerHandler {
    public WebSocketServer: Server;
    public wsServer;
    public server = http.createServer(function(request, response) {
        console.log((new Date()) + ' Received request for ' + request.url);
        response.writeHead(404);
        response.end();
    });

    constructor() {
        this.listen();
        this.wslisten();
        //this.wsServerOn();
    }

    private listen(): void {
        this.server.listen(8085, function() {
            console.log((new Date()) + ' Server is listening on port 8085');
        });
    }

    private wslisten(): void {
        this.wsServer = new Server({
        //this.wsServer = new this.WebSocketServer({
            httpServer: this.server,
            // You should not use autoAcceptConnections for production
            // applications, as it defeats all standard cross-origin protection
            // facilities built into the protocol and the browser.  You should
            // *always* verify the connection's origin and decide whether or not
            // to accept it.
            autoAcceptConnections: false
        });

        this.wsServer.on('request', function(request) {
            if (!this.originIsAllowed(request.origin)) {
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
    }

    private originIsAllowed(origin): boolean {
        // put logic here to detect whether the specified origin is allowed.
        return true;
    }

}

// Exports.
export default new WebsocketServerHandler();

*/