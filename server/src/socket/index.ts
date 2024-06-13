import http from 'http';
import { Server } from 'socket.io';

export default function socket(server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', socket => {
        console.log(socket.client.request.url);
        socket.emit('code-update', code);
        socket.on('code-update', newCode => {
            code = newCode;
            socket.broadcast.emit('code-update', code);
        });
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}

let code = `function solution() {
    var answer;
    return answer;
}`;
