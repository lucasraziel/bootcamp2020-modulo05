import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeStorageProvider from '@shared/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
  it('should be able to update an avatar user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateSuerAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const user = await createUserService.execute({
      name: 'nome',
      email: 'algo@algo.com',
      password: '123456',
    });

    await updateSuerAvatarService.execute({
      user_id: user.id,
      avatarFileName: 'avatar',
    });

    expect(user.avatar).toBe('avatar');
  });

  it('should not be able to update an avatar of a user which does not exist', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateSuerAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );

    expect(
      updateSuerAvatarService.execute({
        user_id: 'dsdsd',
        avatarFileName: 'avatar',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete an old avatar when updating a new one', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateSuerAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const user = await createUserService.execute({
      name: 'nome',
      email: 'algo@algo.com',
      password: '123456',
    });

    await updateSuerAvatarService.execute({
      user_id: user.id,
      avatarFileName: 'avatar',
    });

    await updateSuerAvatarService.execute({
      user_id: user.id,
      avatarFileName: 'avatarNovo',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar');

    expect(user.avatar).toBe('avatarNovo');
  });
});
