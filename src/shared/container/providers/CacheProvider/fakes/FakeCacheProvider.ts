import ICacheProvider from '../models/ICacheProvider';

interface ICache {
  [key: string]: string;
}

export default class FakeCacheProvider implements ICacheProvider {
  private cached: ICache = {};

  public async save(key: string, value: string): Promise<void> {
    this.cached[key] = value;
  }

  public async invalidate(key: string): Promise<void> {
    delete this.cached[key];
  }

  public async recover(key: string): Promise<string | null> {
    return this.cached[key];
  }
}
