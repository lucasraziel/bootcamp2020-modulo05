import { Router } from 'express';
import { uuid } from 'uuidv4';
import { startOfHour, parseISO, isEqual } from 'date-fns';

const appointmentsRouter = Router();

interface Appointment {
  date: Date;
  provider: string;
  id: string;
}

const appointments: Appointment[] = [];

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;

  const parsedDate = startOfHour(parseISO(date));

  const findAppointmentInSameDate = appointments.find((appointment) =>
    isEqual(appointment.date, parsedDate)
  );

  if (findAppointmentInSameDate) {
    return response.status(400).json({
      error: 'This appointment is not available',
    });
  }

  const appointment = {
    provider,
    date: parsedDate,
    id: uuid(),
  };

  appointments.push(appointment);

  return response.json(appointment);
});

export default appointmentsRouter;
