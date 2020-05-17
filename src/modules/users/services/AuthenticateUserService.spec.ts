import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import AuthenticateUserService from './AuthenticateUserService';

describe('AuthenticateUser', () => {
  it('should be able to authenticate a user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const user = await fakeUsersRepository.create({
      name: 'nome',
      email: 'algo@algo.com',
      password: '123456',
    });

    const response = await authenticateUserService.execute({
      email: 'algo@algo.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate a user when it does not exist', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    expect(
      authenticateUserService.execute({
        email: 'algo@algo.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to authenticate when password does not match', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await fakeUsersRepository.create({
      name: 'nome',
      email: 'algo@algo.com',
      password: '123456',
    });

    expect(
      authenticateUserService.execute({
        email: 'algo@algo.com',
        password: '1234567',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
