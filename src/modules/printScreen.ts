import jimp from 'jimp';
import robot from 'robotjs';
import { WebSocket } from 'ws';

export const printScreen = async (ws: WebSocket) => {
  const currentMousePos: {x: number, y: number} = robot.getMousePos();
  const capture = robot.screen.capture(currentMousePos.x - 100, currentMousePos.y - 100, 200, 200);
  const img = new jimp(capture.width, capture.height);
  img.bitmap.data = capture.image;
  const base64: string = await img.getBase64Async(jimp.MIME_PNG);
  const doneBuffer: string = base64.split(',')[1];

  ws.send(`prnt_scrn ${doneBuffer}\0`);
}