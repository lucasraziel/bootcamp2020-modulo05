import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able to create a user', async () => {
    const user = await createUserService.execute({
      name: 'nome',
      email: 'algo@algo.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a user when email exists', async () => {
    await createUserService.execute({
      name: 'nome',
      email: 'algo@algo.com',
      password: '123456',
    });

    await expect(
      createUserService.execute({
        name: 'nome',
        email: 'algo@algo.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
