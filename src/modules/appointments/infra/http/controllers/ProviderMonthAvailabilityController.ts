import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
  async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const { month, year } = request.body;

    const providerMonthAvailabilityService = container.resolve(
      ProviderMonthAvailabilityService
    );

    const providers = await providerMonthAvailabilityService.execute({
      provider_id: id,
      month,
      year,
    });

    return response.json(providers);
  }
}
