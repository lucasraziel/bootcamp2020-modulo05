import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ProviderAppointmentController from '@modules/appointments/infra/http/controllers/ProviderAppointmentController';

const appointmentsRouter = Router();

const appointmentsController = new AppointmentsController();
const providerAppointmentController = new ProviderAppointmentController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get(
  '/me',
  celebrate({
    [Segments.QUERY]: {
      year: Joi.number().required(),
      month: Joi.number().required(),
      day: Joi.number().required(),
    },
  }),
  providerAppointmentController.index
);

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date().required(),
    },
  }),
  appointmentsController.create
);

export default appointmentsRouter;
