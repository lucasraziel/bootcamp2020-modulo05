import { container } from 'tsyringe';
// import config

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';

const providers = {
  disk: DiskStorageProvider,
};

// container.register
// 'nome'
// providers[config.driver]

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers.disk
);
