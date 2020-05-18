import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider
    );
  });

  it('should be able to reset the password', async () => {
    const generatePassword = jest.spyOn(fakeHashProvider, 'generateHash');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'email@qualquer.com',
      password: '123456',
    });

    const userToken = await fakeUserTokensRepository.generate(user.id);

    await resetPasswordService.execute({
      password: '1234567',
      token: userToken.token,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(updatedUser?.password).toBe('1234567');
    expect(generatePassword).toHaveBeenCalledWith('1234567');
  });

  it('should not be able to reset the password with non-existing token', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'email@qualquer.com',
      password: '123456',
    });

    expect(
      resetPasswordService.execute({
        password: '1234567',
        token: 'non-existing token',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with non-existing user', async () => {
    const userToken = await fakeUserTokensRepository.generate('fakeId');

    expect(
      resetPasswordService.execute({
        password: '1234567',
        token: userToken.token,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password if passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'email@qualquer.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        password: '1234567',
        token,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
