import { container } from 'tsyringe';
// import config

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

import EtherealMailProvider from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider';

// const providers = {
//   ethereal: container.resolve(EtherealMailProvider),
//   ses: container.resolve(SESMailProvider)
// }

// container.register
// 'nome'
// providers[config.driver]

container.registerSingleton<IMailProvider>(
  'MailProvider',
  EtherealMailProvider
);
