import { ISocket } from '../socket/ISocket';
import { IRedis } from "./IRedis";


export class Redis implements IRedis {

  constructor(
    private wsProvider: ISocket
  ) {}
  
  async connect(host: string, port: number): Promise<boolean> {
    return this.wsProvider.connect(host, port);
  }
  
  async set(key: string, value: string): Promise<void> {
    const response:string = await this.wsProvider.send(this.buildRequest('SET', key, value));
    if (!response.includes('+OK')) {
      throw new Error(response);
    }
  }

  async get(key: string): Promise<any> {
    return this.parseResponse(await this.wsProvider.send(this.buildRequest('GET', key)));
  }
  
  async delete(key: string): Promise<boolean> {
    const result:string = this.parseResponse(await this.wsProvider.send(this.buildRequest('DEL', key)));
    if (result.substr(0) === '-') return false;
    return true;
  }

  private buildRequest(redisCommand: 'SET' | 'GET' | 'DEL', key: string, value?: any): string {

    const commands = [
      redisCommand,
      key
    ]

    let strValue: string;
    
    if (value === undefined) {
      strValue = '';
    } else if (typeof value === 'string') {
      strValue = value
    } else if (Array.isArray(value) || typeof value === 'object') {
      strValue = JSON.stringify(value);
    } else {
      strValue = String(value);
    }

    if (strValue !== '')
      commands.push(strValue);
    
    const finalCommand = [`*${commands.length}`];

    commands.forEach(command => {
      finalCommand.push(`$${command.length}`);
      finalCommand.push(command);
    });

    return `${finalCommand.join('\r\n')}\r\n`;
  }

  private parseResponse(response: string = ''): any {
    const arrays = response.split('\r\n')
    if (arrays.length === 1) return arrays[0];

    if (arrays.length === 3) {
      return arrays[1];
    }

    return response[response.length - 1];
  }
}