import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
// import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

describe('CreateUser', () => {
  it('should be able to create a user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeMailProvider = new FakeMailProvider();

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider
    );

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'email@qualquer.com',
      password: '123456',
    });

    await sendForgotPasswordEmailService.execute({
      email: 'email@qualquer.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });
});
