import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowPofileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  public async update(request: Request, response: Response): Promise<Response> {
    try {
      const { name, email, password, old_password } = request.body;

      const user_id = request.user.id;

      const updataProfileService = container.resolve(UpdateProfileService);

      const user = await updataProfileService.execute({
        user_id,
        name,
        email,
        password,
        old_password,
      });

      delete user.password;

      return response.json(user);
    } catch (err) {
      return response.status(err.statusCode).json({ error: err.message });
    }
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const showProfile = container.resolve(ShowPofileService);

    const user = await showProfile.execute({ user_id });

    delete user.password;
    return response.json(classToClass(user));
  }
}
