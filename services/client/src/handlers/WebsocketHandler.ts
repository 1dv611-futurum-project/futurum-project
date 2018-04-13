/**
 * Handles the websocket connection against the client.
 */

// Imports.
import * as websocket from 'websocket';
import { client } from 'websocket';
import * as http from 'http';
//import App from '../App';


class WebSocketClientHandler {
    //public WebsocketClient: Client;
    //public client = new this.WebSocketClient();
    public socketClient: client;

    constructor() {
        //this.client = new this.WebsocketClient();
        this.socketClient = new client();
        
        this.clientConnect();
        this.clientOn();
    }

    private clientOn(): void {
        this.socketClient.on('connectFailed', function(error) {
            console.log('Connect Error: ' + error.toString());
        });
         
        this.socketClient.on('connect', function(connection) {
            console.log('WebSocket Client Connected');
            connection.on('error', function(error) {
                console.log("Connection Error: " + error.toString());
            });
            connection.on('close', function() {
                console.log('echo-protocol Connection Closed');
            });
            connection.on('message', function(message) {
                if (message.type === 'utf8') {
                    console.log("Received: '" + message.utf8Data + "'");
                }
            });
            
            function sendNumber() {
                if (connection.connected) {
                    var number = Math.round(Math.random() * 0xFFFFFF);
                    connection.sendUTF(number.toString());
                    setTimeout(sendNumber, 1000);
                }
            }
            sendNumber();
        });
    }

    private clientConnect(): void {
        this.socketClient.connect('ws://localhost:3000/', 'echo-protocol');
    }

}

// Exports.
export default new WebSocketClientHandler();


