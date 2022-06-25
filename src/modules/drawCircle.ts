import robot from 'robotjs';
import { WebSocket } from 'ws';

export const drawCircle = (message: string, ws: WebSocket) => {
  ws.send(message + '\0');

  const [, radius]: string[] = message.toString().split(' ');
  const currentMousePos: {x: number, y: number} = robot.getMousePos();

  robot.setMouseDelay(1);

  const step: number = 0.01 * Math.PI * 2;

  for (let i = 0; i <= Math.PI * 2; i += step) {
    const x: number = currentMousePos.x + (+radius * Math.cos(i));
    const y: number = currentMousePos.y + (+radius * Math.sin(i));
    
    robot.dragMouse(x, y);
    robot.mouseToggle('down');
  }

  robot.mouseToggle('up');
}