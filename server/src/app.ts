import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { observable } from '@trpc/server/observable';

import { z } from 'zod';
import { EventEmitter } from 'events';

import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
app.set('port', process.env.PORT || 4040);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();
const appRouter = t.router({
    hello: t.procedure.query(() => 'Hello World!'),
});
app.use(cors());
app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext,
    })
);

let code = '';

io.on('connection', socket => {
    socket.emit('code-update', code);

    socket.on('code-update', newCode => {
        code = newCode;
        socket.broadcast.emit('code-update', newCode);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번에서 대기중');
});
