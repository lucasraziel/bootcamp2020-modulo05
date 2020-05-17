import fs from 'fs';
import path from 'path';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import User from '@modules/users/infra/typeorm/entities/User';
import UploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

interface IRequest {
  user_id: string;
  avatarFileName: string;
}
class UpdateUserAvatarService {
  constructor(private usersRepository: IUsersRepository) {}

  public async execute({ user_id, avatarFileName }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('This user is not valid');
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(UploadConfig.directory, user.avatar);

      const fileExists = await fs.promises.stat(userAvatarFilePath);

      if (fileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }
    user.avatar = avatarFileName;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
