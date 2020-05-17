import { Router } from 'express';
import multer from 'multer';
import CreateUserService from '@modules/users/services/CreateUserService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import uploadConfig from '@config/upload';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

const usersRoute = Router();
const upload = multer(uploadConfig);

usersRoute.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const usersRespository = new UsersRepository();

    const createUserService = new CreateUserService(usersRespository);

    const user = await createUserService.execute({
      name,
      email,
      password,
    });

    delete user.password;

    return response.json(user);
  } catch (err) {
    return response.status(err.statusCode).json({ error: err.message });
  }
});

usersRoute.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const usersRespository = new UsersRepository();
    const updateAtavarService = new UpdateUserAvatarService(usersRespository);

    const user = await updateAtavarService.execute({
      user_id: request.user.id,
      avatarFileName: request.file.filename,
    });

    return response.json(user);
  }
);

export default usersRoute;
