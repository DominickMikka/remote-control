import robot from 'robotjs';
import { WebSocket } from 'ws';

export const drawSquare = (message: string, ws: WebSocket) => {

  ws.send(message + '\0');

  const [, width]: string[] = message.toString().split(' ');

  let currentMousePos: {x: number, y: number} = robot.getMousePos();

  robot.setMouseDelay(1);
  robot.mouseToggle('down');

  let y: number = currentMousePos.y - +width;

  while (currentMousePos.y !== y) {
    robot.dragMouse(currentMousePos.x, currentMousePos.y);
    currentMousePos.y--;
  }

  currentMousePos = robot.getMousePos();

  let x: number = currentMousePos.x + +width;

  while (currentMousePos.x !== x) {
    robot.dragMouse(currentMousePos.x, currentMousePos.y);
    currentMousePos.x++;
  }

  currentMousePos = robot.getMousePos();

  y = currentMousePos.y + +width;

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