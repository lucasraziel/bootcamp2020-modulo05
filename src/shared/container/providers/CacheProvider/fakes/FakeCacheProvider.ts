import ICacheProvider from '../models/ICacheProvider';

interface ICache {
  [key: string]: string;
}

export default class FakeCacheProvider implements ICacheProvider {
  private cached: ICache = {};

  public async save(key: string, value: any): Promise<void> {
    this.cached[key] = JSON.stringify(value);
  }

  public async invalidate(key: string): Promise<void> {
    delete this.cached[key];
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = this.cached[key];
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    console.log(prefix);

    this.cached = {};
  }
}
