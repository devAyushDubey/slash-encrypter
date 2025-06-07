import { error } from "console";
import { createCipheriv, createDecipheriv } from "crypto";
import { cloneDeep } from "lodash";

export type Message = {
  algorithm: string;
  secret: string;
  iv: Buffer;
  text: string;
  mode: 'encrypter' | 'decrypter';
  cipher: string;
}

console.log('Worker received message');


addEventListener("message", (event: MessageEvent<Message>) => {
  console.log('Worker received message', event.data);
  const { algorithm, secret, iv, text, mode, cipher } = event.data;

  if(!algorithm || !secret || !iv || !mode) {
    throw new Error('Missing required parameters');
  }
  if(mode === 'decrypter') {
    try {
      if(cipher) {
        const decifer = createDecipheriv(algorithm, Buffer.from(secret, 'utf8'), iv);
        let decrypted = decifer.update(cipher, 'hex');
        decrypted = Buffer.concat([decrypted, decifer.final()]);
        postMessage({
          value: decrypted.toString('utf8'),
          operation: 'decryption'
        });
      }
    }
    catch(e) {
      console.log('Error', e);
      postMessage({
        error: {
          type: 'wrong-cipher',
          data: e
        }
      });
    }
    if(!cipher) {
      postMessage({
        error: {
          type: 'no-cipher'
        }
      })
    }
  }
  else {
    try{
      if(text) {
        const cipher = createCipheriv(algorithm, Buffer.from(secret, 'utf8'), iv);
        let encrypted = cipher.update(text ?? '', 'utf8');
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        postMessage({
          value: encrypted.toString('hex'),
          operation: 'encryption'
        });
      }
    }
    catch(e) {
      console.log('Error', e);
      postMessage({
        error: {
          type: 'wrong-text',
          data: e
        }
      });
    }
    if(!text) {
      postMessage({
        error: {
          type: 'no-text'
        }
      })
    }
  }
});