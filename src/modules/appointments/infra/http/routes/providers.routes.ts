import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProviderController from '@modules/appointments/infra/http/controllers/ProviderController';
import ProviderDayAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderDayAvailabilityController';
import ProviderMonthAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderMonthAvailabilityController';

const providersRouter = Router();

const appointmentsController = new ProviderController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();

providersRouter.use(ensureAuthenticated);

// providersRouter.get('/', async (request, response) => {
//   const appointments = await appointmentsRepository.find();

//   return response.json(appointments);
// });

providersRouter.post(
  '/:id/month-availability',
  providerMonthAvailabilityController.index
);
providersRouter.post(
  '/:id/daily-availability',
  providerDayAvailabilityController.index
);

providersRouter.get('/', appointmentsController.index);
export default providersRouter;
