import { uuid } from 'uuidv4';
import IUserTokenRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

export default class FakeUserTokensRepository implements IUserTokenRepository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: Date.now(),
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const findUserToken = this.userTokens.find(
      (userToken) => userToken.token === token
    );

    return findUserToken;
  }
}
