import IMailTemplateProvider from '../models/IMailTemplateProvider';
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async parse({
    template,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    variables,
  }: IParseMailTemplateDTO): Promise<string> {
    return template;
  }
}
