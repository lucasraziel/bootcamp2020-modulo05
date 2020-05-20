import { injectable, inject } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  user_id: string;
}
@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({ user_id }: IRequest): Promise<User[]> {
    let users = await this.cacheProvider.recover<User[]>(
      `providers-list:${user_id}`
    );

    if (users) {
      return users;
    }

    console.log('A query no banco foi feita');

    if (user_id) {
      const user = await this.usersRepository.findById(user_id);

      if (!user) {
        throw new AppError('Invalid User');
      }
    }

    users = await this.usersRepository.findAllProviders({
      except_user_id: user_id,
    });

    await this.cacheProvider.save(`providers-list:${user_id}`, users);

    return users;
  }
}

export default ListProvidersService;
