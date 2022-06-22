"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const robotjs_1 = __importDefault(require("robotjs"));
const ws_1 = require("ws");
const fs_1 = require("fs");
const path_1 = require("path");
const http_1 = require("http");
const HTTP_PORT = 8080;
const server = (0, http_1.createServer)((req, res) => {
    const __dirname = (0, path_1.resolve)((0, path_1.dirname)(''));
    const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
    (0, fs_1.readFile)(file_path, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
});
const wss = new ws_1.WebSocketServer({ server });
server.listen(HTTP_PORT, () => {
    console.log(`Server started, port: ${HTTP_PORT}`);
});
wss.on('connection', ws => {
    ws.on('message', (msg) => {
        ws.send(msg.toString());
        const [command, offset] = msg.toString().split(' ');
        const currentMousePos = robotjs_1.default.getMousePos();
        switch (command) {
            case 'mouse_up':
                robotjs_1.default.moveMouseSmooth(currentMousePos.x, currentMousePos.y - +offset);
                break;
            case 'mouse_down':
                robotjs_1.default.moveMouseSmooth(currentMousePos.x, currentMousePos.y + +offset);
                break;
            case 'mouse_left':
                robotjs_1.default.moveMouseSmooth(currentMousePos.x - +offset, currentMousePos.y);
                break;
            case 'mouse_right':
                robotjs_1.default.moveMouseSmooth(currentMousePos.x + +offset, currentMousePos.y);
                break;
            default:
                break;
        }
    });
});
