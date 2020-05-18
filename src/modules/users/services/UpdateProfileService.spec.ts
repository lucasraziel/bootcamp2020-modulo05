import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able to update the profile user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'nome',
      email: 'algo@algo.com',
      password: '123456',
    });

    await updateProfileService.execute({
      user_id: user.id,
      name: 'outro nome',
      email: 'outroemail@mail.com',
    });

    expect(user.name).toBe('outro nome');
    expect(user.email).toBe('outroemail@mail.com');
    expect(user.id).toBe(user.id);
  });

  it('should not be able to update the profile of a non-existing user', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'fakeID',
        name: 'outro nome',
        email: 'outroemail@mail.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the profile with email of another user', async () => {
    await fakeUsersRepository.create({
      name: 'nome',
      email: 'algo@algo.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'nome',
      email: 'outroemail@algo.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'outro nome',
        email: 'algo@algo.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'nome',
      email: 'algo@algo.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'outro nome',
      email: 'algo@algo.com',
      password: '1234567',
      old_password: '123456',
    });

    expect(updatedUser.password).toBe('1234567');
  });

  it('should not be able to update the password without old_password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'nome',
      email: 'algo@algo.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'outro nome',
        email: 'algo@algo.com',
        password: '1234567',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old_password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'nome',
      email: 'algo@algo.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'outro nome',
        email: 'algo@algo.com',
        password: '1234567',
        old_password: '12345678',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
