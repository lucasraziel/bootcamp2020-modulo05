import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderService from './ListProviderService';

let fakeUsersRepository: FakeUsersRepository;
let listProviderService: ListProviderService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderService = new ListProviderService(
      fakeUsersRepository,
      fakeCacheProvider
    );
  });

  it('should be able to list the providers', async () => {
    await fakeUsersRepository.create({
      name: 'nome',
      email: 'algo@algo.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'nome',
      email: 'algos@algo.com',
      password: '123456',
    });

    const providers = await listProviderService.execute({
      user_id: user.id,
    });

    expect(Array.isArray(providers)).toBe(true);
    expect(providers.length).toBe(1);
    expect(providers[0].email).toBe('algo@algo.com');
  });

  it('should not be able to list the providers trying to remove the provider', async () => {
    await expect(
      listProviderService.execute({
        user_id: 'fakeID',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
