import { ISocket } from './ISocket';
import * as net from 'net';

let resolveFunc:any = undefined;
let rejectFunc:any = undefined;

export class RedisSocket implements ISocket {

  private net: net.Socket;
  
  constructor() {
    this.net = new net.Socket();
  }

  async connect(host: string, port: number): Promise<boolean> {
    this.net.connect({
      host,
      port,
    });

    this.net.on('data', this.getResponse);
    return true;
  }

  async send(str: string): Promise<string> {
    return new Promise((resolve, reject) => {
      resolveFunc = resolve;
      rejectFunc = reject;

      this.net.write(str, 'utf8');
    });
  }

  private getResponse(data: Buffer) {
    if (!resolveFunc || !rejectFunc) return;

    if (data !== undefined) {
      rejectFunc = undefined;
      resolveFunc(data.toString());
      return;
    }

    resolveFunc = undefined;
    rejectFunc({ message: 'invalid data', raw: data });
  }

}