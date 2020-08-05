import { IRedis } from './redis/IRedis';

export class Handler {
  constructor(
    private host: string,
    private port: number,
    private redisProvider: IRedis
  ) {}

  async execute() {
    try {
      await this.redisProvider.connect(this.host, this.port);

      console.log('\r\nexecutando: set programar "Arte de transformar café em código"');
      await this.redisProvider.set('programar', 'Arte de transformar café em código');

      console.log('\r\nexecutando: get programar');
      const get = await this.redisProvider.get('programar');
      console.log('resposta: ', get);
      
      console.log('\r\nexecutando: del programar');
      const deleteKey = await this.redisProvider.delete('programar');
      console.log('resposta: ', deleteKey);

    } catch(err) {
      console.log('deu ruim!!!!')
      console.log(err);
    }
  }
}