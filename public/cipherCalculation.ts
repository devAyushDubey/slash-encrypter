import { createCipheriv } from "crypto";

type Message = {
  algorithm: string;
  secret: string;
  iv: Buffer;
  text: string;
}

addEventListener("message", (event: MessageEvent<Message>) => {
  const { algorithm, secret, iv, text } = event.data;

  if(!algorithm || !secret || !iv || !text) {
    throw new Error('Missing required parameters');
  }
  
  const cipher = createCipheriv(algorithm, Buffer.from(secret, 'utf8'), iv);
  
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  postMessage(encrypted.toString('hex'));
});