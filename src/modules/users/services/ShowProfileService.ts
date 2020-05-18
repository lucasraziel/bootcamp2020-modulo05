import { injectable, inject } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
}
@injectable()
class ShowPofileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({ user_id }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exist');
    }

    return user;
  }
}

export default ShowPofileService;
