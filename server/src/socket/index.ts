import http from 'http';
import { Server } from 'socket.io';

let code = `function solution() {
    var answer;
    return answer;
}`;

const cursorMap = new Map<string, any>();
const users: Record<string, any> = {};
const socketToRoom: Record<string, any> = {};

export default function socket(server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
        },
        cookie: {
            name: 'coding-us-cookie',
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 86400,
        },
    });

    io.on('connection', socket => {
        console.log('a user connected: ' + socket.id);

        socket.emit('code-update', code);
        socket.on('code-update', newCode => {
            code = newCode;
            socket.broadcast.emit('code-update', code);
        });

        socket.on('cursor-move', data => {
            cursorMap.set(socket.id, data);
            socket.broadcast.emit('cursor-move', Object.fromEntries(cursorMap));
        });

        socket.on('join room', roomID => {
            if (users[roomID]) {
                const length = users[roomID].length;
                if (length === 4) {
                    socket.emit('room full');
                    return;
                }
                users[roomID].push(socket.id);
            } else {
                users[roomID] = [socket.id];
            }
            socketToRoom[socket.id] = roomID;
            const usersInThisRoom = users[roomID].filter((id: string) => id !== socket.id);
            socket.emit('all users', usersInThisRoom);
        });

        socket.on('sending signal', payload => {
            io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
        });

        socket.on('returning signal', payload => {
            io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
        });

        socket.on('disconnect', () => {
            const roomID = socketToRoom[socket.id];
            let room = users[roomID];
            if (room) {
                room = room.filter((id: string) => id !== socket.id);
                users[roomID] = room;
            }
        });
    });
}
