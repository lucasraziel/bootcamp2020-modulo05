import { Router } from 'express';
import { container } from 'tsyringe';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

const sessionsRoute = Router();

sessionsRoute.post('/', async (request, response) => {
  const { email, password } = request.body;
  const authenticateUserService = container.resolve(AuthenticateUserService);

  const { user, token } = await authenticateUserService.execute({
    email,
    password,
  });
  return response.json({ user, token });
});

export default sessionsRoute;
