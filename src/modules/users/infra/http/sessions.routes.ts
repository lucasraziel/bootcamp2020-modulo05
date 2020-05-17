import { Router } from 'express';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

const sessionsRoute = Router();

sessionsRoute.post('/', async (request, response) => {
  const { email, password } = request.body;
  const usersRespository = new UsersRepository();
  const authenticateUserService = new AuthenticateUserService(usersRespository);

  const { user, token } = await authenticateUserService.execute({
    email,
    password,
  });
  return response.json({ user, token });
});

export default sessionsRoute;
