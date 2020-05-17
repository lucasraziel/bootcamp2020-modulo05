import { compare, hash } from 'bcryptjs';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

export default class HashProvider implements IHashProvider {
  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    const resultCompare = await compare(payload, hashed);
    return resultCompare;
  }

  public async generateHash(payload: string): Promise<string> {
    const hashPassword = await hash(payload, 8);

    return hashPassword;
  }
}
