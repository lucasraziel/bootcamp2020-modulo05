import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProviderController from '@modules/appointments/infra/http/controllers/ProviderController';

const providersRouter = Router();

const appointmentsController = new ProviderController();

providersRouter.use(ensureAuthenticated);

// providersRouter.get('/', async (request, response) => {
//   const appointments = await appointmentsRepository.find();

//   return response.json(appointments);
// });

providersRouter.get('/', appointmentsController.index);

export default providersRouter;
