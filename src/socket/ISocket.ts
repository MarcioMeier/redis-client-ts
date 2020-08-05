export interface ISocket {
  connect(host: string, port: number): Promise<boolean>;
  send(str: string): Promise<string>;
}