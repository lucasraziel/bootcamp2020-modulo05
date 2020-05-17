import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('AuthenticateUser', () => {
  it('should be able to update an avatar user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateSuerAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );

    const user = await fakeUsersRepository.create({
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
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateSuerAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );

    const user = await fakeUsersRepository.create({
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
