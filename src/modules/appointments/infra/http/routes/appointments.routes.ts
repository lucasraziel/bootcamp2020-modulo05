import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ProviderAppointmentController from '@modules/appointments/infra/http/controllers/ProviderAppointmentController';

const appointmentsRouter = Router();

const appointmentsController = new AppointmentsController();
const providerAppointmentController = new ProviderAppointmentController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post('/', appointmentsController.create);
appointmentsRouter.post('/me', providerAppointmentController.index);

export default appointmentsRouter;
