import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarControlller {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateAtavarService = container.resolve(UpdateUserAvatarService);

    const user = await updateAtavarService.execute({
      user_id: request.user.id,
      avatarFileName: request.file.filename,
    });

    return response.json(user);
  }
}
