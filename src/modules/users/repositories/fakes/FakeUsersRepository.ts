import { uuid } from 'uuidv4';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '@modules/users/infra/typeorm/entities/User';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindProvidersDTO';

class UsersRepository implements IUsersRepository {
  users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const existUser = this.users.find((user) => user.id === id);

    return existUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const existUser = this.users.find((user) => user.email === email);

    return existUser;
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid(), name, email, password });

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    this.users = this.users.filter((userItem) => userItem.id !== user.id);

    this.users.push(user);

    return user;
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let { users } = this;

    if (except_user_id) {
      users = users.filter((user) => user.id !== except_user_id);
    }

    return users;
  }
}

export default UsersRepository;
