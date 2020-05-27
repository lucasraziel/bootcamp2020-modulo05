import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
  async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { day, month, year } = request.query;

    const providerDayAvailabilityService = container.resolve(
      ProviderDayAvailabilityService
    );

    const providers = await providerDayAvailabilityService.execute({
      provider_id: id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    return response.json(providers);
  }
}
