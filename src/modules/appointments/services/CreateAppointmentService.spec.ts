import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentsRepository();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentRepository
    );
  });

  it('should be able to create a new appointment', async () => {
    const appointmentDate = new Date();

    appointmentDate.setDate(appointmentDate.getDate() + 1);
    appointmentDate.setHours(13);
    const appointment = await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: '12232332',
      user_id: '323232',
    });

    expect(appointment).toHaveProperty('id');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date();

    appointmentDate.setDate(appointmentDate.getDate() + 1);
    appointmentDate.setHours(13);

    await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: '12232332',
      user_id: '323232',
    });

    expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: '12232332',
        user_id: '323232',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create two appointments on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 10, 11),
        provider_id: '12232332',
        user_id: '323232',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create an appointment with same user as provider', async () => {
    const appointmentDate = new Date();

    appointmentDate.setDate(appointmentDate.getDate() + 1);
    await expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: '12232332',
        user_id: '12232332',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new appointment before 8 or after 17', async () => {
    const appointmentDate = new Date();

    appointmentDate.setDate(appointmentDate.getDate() + 2);
    appointmentDate.setHours(7);
    await expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: '12232332',
        user_id: '323232',
      })
    ).rejects.toBeInstanceOf(AppError);

    appointmentDate.setHours(18);
    await expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: '12232332',
        user_id: '323232',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
