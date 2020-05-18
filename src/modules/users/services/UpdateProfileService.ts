import { injectable, inject } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}
@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exist');
    }

    const checkExistEmail = await this.usersRepository.findByEmail(email);

    if (checkExistEmail && user.id !== checkExistEmail.id) {
      throw new AppError('This email is already recorded');
    }

    user.name = name;

    user.email = email;

    if (password && !old_password) {
      throw new AppError('Old password must be informed');
    }

    if (password && old_password) {
      const compare = await this.hashProvider.compareHash(
        old_password,
        user.password
      );

      if (!compare) {
        throw new AppError('Old password does not match');
      }
    }

    if (password) {
      user.password = await this.hashProvider.generateHash(password);
    }

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateProfileService;
