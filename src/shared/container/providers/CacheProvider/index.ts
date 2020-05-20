import { container } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import RedisCacheProvider from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider';

const providers = {
  redis: RedisCacheProvider,
};

// container.register
// 'nome'
// providers[config.driver]

container.registerSingleton<ICacheProvider>('CacheProvider', providers.redis);
