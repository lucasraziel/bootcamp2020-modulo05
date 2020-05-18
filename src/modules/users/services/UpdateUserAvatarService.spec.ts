import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateSuerAvatarService: UpdateUserAvatarService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateSuerAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );
  });

  it('should be able to update an avatar user', async () => {
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
    expect(
      updateSuerAvatarService.execute({
        user_id: 'dsdsd',
        avatarFileName: 'avatar',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete an old avatar when updating a new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

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
