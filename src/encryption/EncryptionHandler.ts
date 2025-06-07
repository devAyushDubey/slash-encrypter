import { createHmac, createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { Worker } from "worker_threads";

export function generateCipher(secret: string, algorithm: string, text: string, iv: Buffer) {

  // const worker = new Worker('./cipherCalculation.ts', {workerData: {secret, algorithm, text, iv}});
  
  // return new Promise<string>((resolve, reject) => {
  //   worker.on('message', (encrypted: string) => {
  //     resolve(encrypted);
  //   });
  //   worker.on('error', reject);
  //   worker.on('exit', (code) => {
  //     if(code !== 0) {
  //       reject(new Error(`Worker stopped with exit code ${code}`));
  //     }
  //   });
  // });
}