import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProfileController from '@modules/users/infra/http/controllers/ProfileController';
import { celebrate, Segments, Joi } from 'celebrate';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().when(Joi.ref('old_password'), {
        then: Joi.string().min(6),
      }),
      old_password: Joi.string(),
      password_confirmation: Joi.string().when(Joi.ref('old_password'), {
        then: Joi.string().required().valid(Joi.ref('password')),
      }),
    },
  }),
  profileController.update
);
profileRouter.get('/', profileController.show);

export default profileRouter;
