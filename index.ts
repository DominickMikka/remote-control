import Jimp from 'jimp';
import robot from 'robotjs';
import { WebSocketServer } from 'ws';
import { readFile } from 'fs';
import { resolve, dirname } from 'path';
import { createServer } from 'http';

const HTTP_PORT = 8080;

const server = createServer((req, res) => {
  const __dirname = resolve(dirname(''));
  const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);

  readFile(file_path, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });

server.listen(HTTP_PORT, () => {
  console.log(`Server started, port: ${HTTP_PORT} Link: http://localhost:8080/`);
});

wss.on('connection', ws => {
  ws.on('message', (buffer) => {
    const message = buffer.toString();
    
    if (message.startsWith('mouse_up')) {
      ws.send(message);
      const [command, offset] = message.toString().split(' ');
      const currentMousePos = robot.getMousePos();
      robot.moveMouseSmooth(currentMousePos.x, currentMousePos.y - +offset);
    } else 

    if (message.startsWith('mouse_down')) {
      ws.send(message);
      const [command, offset] = message.toString().split(' ');
      const currentMousePos = robot.getMousePos();
      robot.moveMouseSmooth(currentMousePos.x, currentMousePos.y + +offset);
    } else

    if (message.startsWith('mouse_left')) {
      ws.send(message);
      const [command, offset] = message.toString().split(' ');
      const currentMousePos = robot.getMousePos();
      robot.moveMouseSmooth(currentMousePos.x - +offset, currentMousePos.y);
    } else

    if (message.startsWith('mouse_right')) {
      ws.send(message);
      const [command, offset] = message.toString().split(' ');
      const currentMousePos = robot.getMousePos();
      robot.moveMouseSmooth(currentMousePos.x + +offset, currentMousePos.y);
    } else

    if (message.startsWith('mouse_position')) {
      const currentMousePos = robot.getMousePos();
      ws.send(`mouse_position ${currentMousePos.x}px,${currentMousePos.y}px`);
    } else

    if (message.startsWith('draw_circle')) {
      ws.send(message);
      const [command, radius] = message.toString().split(' ');
      const currentMousePos = robot.getMousePos();

      robot.setMouseDelay(1);

      for (let i = 0; i <= Math.PI * 2; i += 0.01) {
        const x = currentMousePos.x + (+radius * Math.cos(i));
        const y = currentMousePos.y + (+radius * Math.sin(i));
        
        robot.dragMouse(x, y);
        robot.mouseToggle('down');
      }
      robot.mouseToggle('up');
    } else

    if (message.startsWith('draw_rectangle')) {
      ws.send(message);
      const [command, length, width] = message.toString().split(' ');
      let currentMousePos = robot.getMousePos();

      robot.setMouseDelay(1);
      robot.mouseToggle('down');

      let y = currentMousePos.y - +length;

      while (currentMousePos.y !== y) {
        robot.dragMouse(currentMousePos.x, currentMousePos.y);
        currentMousePos.y--;
      }

      currentMousePos = robot.getMousePos();

      let x = currentMousePos.x + +width;

      while (currentMousePos.x !== x) {
        robot.dragMouse(currentMousePos.x, currentMousePos.y);
        currentMousePos.x++;
      }

      currentMousePos = robot.getMousePos();

      y = currentMousePos.y + +length;

      while (currentMousePos.y !== y) {
        robot.dragMouse(currentMousePos.x, currentMousePos.y);
        currentMousePos.y++;
      }

      currentMousePos = robot.getMousePos();

      x = currentMousePos.x - +width;

      while (currentMousePos.x !== x) {
        robot.dragMouse(currentMousePos.x, currentMousePos.y);
        currentMousePos.x--;
      }

      robot.mouseToggle('up');
    }

  });
});