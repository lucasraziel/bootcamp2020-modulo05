import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
// import User from '@modules/users/infra/typeorm/entities/User';
// import AppError from '@shared/errors/AppError';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;
@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    provider_id,
    month,
    year,
    day,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        month,
        year,
        provider_id,
        day,
      }
    );

    const eachHourArray = Array.from(
      { length: 10 },
      (value, index) => index + 8
    );

    const currentDate = new Date(Date.now());

    const availability = eachHourArray.map((hour) => {
      const appointmentInHour = appointments.find((appointment) => {
        return getHours(appointment.date) === hour;
      });

      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !appointmentInHour && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
