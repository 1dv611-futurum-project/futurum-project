import * as http from 'http';
import App from './App';


import * as io from 'socket.io';


const port = process.env.PORT || 3000;
const server = http.createServer(App);

//let ioServer: SocketIO.Server = io(server);

App.listen(port, (err) => {
	if (err) {
		return console.log(err);
	}

	return console.log(`Server is listening on ${port}`);
});


/*
ioServer.on('connection', function (socket: SocketIO.Socket): void {
    console.log('Socket connected');
    socket.on('serverName', function (): void {
        socket.emit('serverName', {
            name: 'expressjs'
        });
        console.log('Socket received serverName');
    });
});
*/