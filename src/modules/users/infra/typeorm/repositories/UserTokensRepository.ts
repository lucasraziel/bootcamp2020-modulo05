import { getRepository } from 'typeorm';
import { uuid } from 'uuidv4';
import IUserTokenRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

export default class UserTokensRepository implements IUserTokenRepository {
  private userTokens = getRepository(UserToken);

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = await this.userTokens.create({ token: uuid(), user_id });

    this.userTokens.save(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const findUserToken = await this.userTokens.findOne({ where: { token } });

    return findUserToken;
  }
}
