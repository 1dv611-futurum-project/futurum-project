/**
 * Handles the websocket connection against the client.
 */

/*

// Imports.
import * as websocket from 'websocket';
import { Server, Client, Frame, Router, W3cwebsocket} from 'websocket';
import * as http from 'http';
//import App from '../App';


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