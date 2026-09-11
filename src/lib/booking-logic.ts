import { Schedule, ScheduleOverride, Appointment } from '@/types';
import { addMinutes, format, parse, isBefore, isAfter } from 'date-fns';

export interface TimeSlot {
  time: string; // "14:00"
  datetime: string; // ISO
  available: boolean;
  reason?: string;
}

// Horarios semanales por defecto simulados (pueden ser personalizados luego en el admin)
export const MOCK_SCHEDULES: Record<string, { days: number[]; start: string; end: string }> = {
  p_ailin: { days: [1, 2, 3, 4, 5], start: "09:00", end: "19:00" },
  p_patricia: { days: [1, 2, 3, 4, 5, 6], start: "10:00", end: "20:00" },
  p_sofia: { days: [2, 4, 6], start: "13:00", end: "19:00" },
  p_natali: { days: [1, 3, 5], start: "09:00", end: "18:00" },
  p_celeste: { days: [1, 2, 3, 4, 5], start: "11:00", end: "20:00" },
  p_mauro: { days: [1, 3, 5], start: "14:00", end: "20:00" },
  p_ivana: { days: [2, 4, 6], start: "10:00", end: "17:00" },
  p_francisco: { days: [3, 5, 6], start: "14:00", end: "19:00" },
};

export function getAvailableSlots(
  professionalId: string,
  targetDate: Date,
  durationMinutes: number,
  existingAppointments: Appointment[]
): TimeSlot[] {
  const dayOfWeek = targetDate.getDay();
  const schedule = MOCK_SCHEDULES[professionalId] || { days: [1, 2, 3, 4, 5], start: "10:00", end: "19:00" };

  if (!schedule || !schedule.days.includes(dayOfWeek)) {
    return [];
  }

  const slots: TimeSlot[] = [];
  const dateStr = format(targetDate, 'yyyy-MM-dd');
  
  let current = parse(`${dateStr} ${schedule.start}`, 'yyyy-MM-dd HH:mm', new Date());
  const endOfDay = parse(`${dateStr} ${schedule.end}`, 'yyyy-MM-dd HH:mm', new Date());

  while (isBefore(addMinutes(current, durationMinutes), endOfDay) || +addMinutes(current, durationMinutes) === +endOfDay) {
    const slotStart = new Date(current);
    const slotEnd = addMinutes(slotStart, durationMinutes);
    const timeStr = format(slotStart, 'HH:mm');

    // Chequear si se superpone con un turno confirmado existente
    const isBooked = existingAppointments.some(app => {
      if (app.professional_id !== professionalId) return false;
      if (app.status !== 'CONFIRMED') return false;

      const appStart = new Date(app.start_datetime);
      const appEnd = new Date(app.end_datetime);

      return isBefore(slotStart, appEnd) && isAfter(slotEnd, appStart);
    });

    slots.push({
      time: timeStr,
      datetime: slotStart.toISOString(),
      available: !isBooked,
      reason: isBooked ? 'Ocupado' : undefined
    });

    current = addMinutes(current, 30);
  }

  return slots;
}
