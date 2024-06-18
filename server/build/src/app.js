"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const socket_1 = __importDefault(require("./socket"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.set('port', process.env.PORT || 4040);
const server = http_1.default.createServer(app);
(0, socket_1.default)(server);
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.send('test');
});
server.listen(app.get('port'), () => {
    console.log(app.get('port'), '번에서 대기중');
});
