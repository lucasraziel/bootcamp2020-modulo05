import { container } from 'tsyringe';
// import config

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

import HandleBarsMailProvider from '@shared/container/providers/MailTemplateProvider/implementations/HandleBarsMailTemplateProvider';

// const providers = {
//   ethereal: container.resolve(EtherealMailProvider),
//   ses: container.resolve(SESMailProvider)
// }

// container.register
// 'nome'
// providers[config.driver]

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandleBarsMailProvider
);
