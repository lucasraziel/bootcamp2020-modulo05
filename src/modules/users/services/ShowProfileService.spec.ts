import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show the profile user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'nome',
      email: 'algo@algo.com',
      password: '123456',
    });

    const profile = await showProfileService.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('nome');
    expect(profile.email).toBe('algo@algo.com');
  });

  it('should not be able to show the profile of a non-existing user', async () => {
    await expect(
      showProfileService.execute({
        user_id: 'fakeID',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
