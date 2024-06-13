import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import socket from './socket';

dotenv.config();

const app = express();
app.set('port', process.env.PORT || 4040);

const server = http.createServer(app);
socket(server);

app.use(cors());
app.get('/', (req, res) => {
    res.send('test');
});

server.listen(app.get('port'), () => {
    console.log(app.get('port'), '번에서 대기중');
});
