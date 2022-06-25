import robot from 'robotjs';
import { WebSocket } from 'ws';

export const mouseMove = (message: string, ws: WebSocket, position: string) => {
  const [, offset] = message.toString().split(' ');
  const currentMousePos = robot.getMousePos();
  
  switch (position) {
    case 'mouseUp':
      robot.moveMouseSmooth(currentMousePos.x, currentMousePos.y - +offset);
      break;
    case 'mouseDown':
      robot.moveMouseSmooth(currentMousePos.x, currentMousePos.y + +offset);
      break;
    case 'mouseLeft':
      robot.moveMouseSmooth(currentMousePos.x - +offset, currentMousePos.y);
      break;
    case 'mouseRight':
      robot.moveMouseSmooth(currentMousePos.x + +offset, currentMousePos.y);
      break;
    default:
      break;
  }

  ws.send(message + '\0');
}

export const mousePosition = (ws: WebSocket) => {
  const currentMousePos = robot.getMousePos();
  ws.send(`mouse_position ${currentMousePos.x}px,${currentMousePos.y}px`);
}