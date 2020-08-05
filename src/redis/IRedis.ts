export interface IRedis {
  connect(host: string, port: number): Promise<boolean>;
  set(key: string, value: string): Promise<void>;
  get(key: string) : Promise<any>;
  delete(key: string) : Promise<boolean>;
}