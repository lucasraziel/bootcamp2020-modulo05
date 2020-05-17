import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentRepository = new FakeAppointmentsRepository();

    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentRepository
    );

    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: '12232332',
    });

    expect(appointment).toHaveProperty('id');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const fakeAppointmentRepository = new FakeAppointmentsRepository();

    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentRepository
    );

    const appointmentDate = new Date();

    await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: '12232332',
    });

    expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: '12232332',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
