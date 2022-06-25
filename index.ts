import { readFile } from 'fs';
import { resolve, dirname } from 'path';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { mouseMove, mousePosition } from './src/modules/mouseNavigation';
import { drawCircle } from './src/modules/drawCircle';
import { drawRectangle } from './src/modules/drawRectangle';
import { drawSquare } from './src/modules/drawSquare';
import { printScreen } from './src/modules/printScreen';

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
  ws.on('message', async (buffer) => {
    const message: string = buffer.toString();
    console.log(message);

    if (message.startsWith('mouse_up')) {
      mouseMove(message, ws, 'mouseUp');
    } else if (message.startsWith('mouse_down')) {
      mouseMove(message, ws, 'mouseDown');
    } else if (message.startsWith('mouse_left')) {
      mouseMove(message, ws, 'mouseLeft');
    } else if (message.startsWith('mouse_right')) {
      mouseMove(message, ws, 'mouseRight');
    } else if (message.startsWith('mouse_position')) {
      mousePosition(ws);
    } else if (message.startsWith('draw_circle')) {
      drawCircle(message, ws);
    } else if (message.startsWith('draw_rectangle')) {
      drawRectangle(message, ws);
    } else if (message.startsWith('draw_square')) {
      drawSquare(message, ws);
    } else if (message.startsWith('prnt_scrn')) {
      printScreen(ws);
    }
  });
});

process.on('SIGINT', () => {
  process.stdout.write('WSS server closed');
  wss.close();
  server.close();
  process.exit();
});