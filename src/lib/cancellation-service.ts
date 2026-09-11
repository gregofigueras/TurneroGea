import { Appointment } from "@/types";

// Simula la base de datos de turnos en memoria/servidor
export let APPOINTMENTS_STORE: Appointment[] = [
  {
    id: "app-100",
    cancellation_code: "TRN-PRO1",
    professional_id: "p_ailin",
    service_id: "s_descontracturante",
    start_datetime: "2026-09-15T15:00:00.000Z",
    end_datetime: "2026-09-15T15:50:00.000Z",
    client_name: "María Fernández",
    client_phone: "2235438952",
    client_email: "maria@ejemplo.com",
    status: "CANCELLED_BY_PRO",
    cancel_reason: "Urgencia médica del profesional",
    cancelled_at: "2026-09-11T12:00:00.000Z",
    source: "ONLINE",
    created_at: "2026-09-10T10:00:00.000Z"
  },
  {
    id: "app-101",
    cancellation_code: "TRN-CLI1",
    professional_id: "p_patricia",
    service_id: "s_relajante",
    start_datetime: "2026-09-16T16:00:00.000Z",
    end_datetime: "2026-09-16T16:50:00.000Z",
    client_name: "Gonzalo Ramos",
    client_phone: "2235438952",
    client_email: "gonzalo@ejemplo.com",
    status: "CANCELLED_BY_CLIENT",
    cancelled_at: "2026-09-11T10:00:00.000Z",
    source: "ONLINE",
    created_at: "2026-09-10T10:00:00.000Z"
  },
  {
    id: "app-102",
    cancellation_code: "TRN-CONF",
    professional_id: "p_celeste",
    service_id: "s_shiroabhyanga",
    start_datetime: "2026-09-17T14:00:00.000Z",
    end_datetime: "2026-09-17T14:50:00.000Z",
    client_name: "Laura Benítez",
    client_phone: "2235438952",
    client_email: "laura@ejemplo.com",
    status: "CONFIRMED",
    source: "ONLINE",
    created_at: "2026-09-10T10:00:00.000Z"
  }
];

export type CancelSearchResult = 
  | { success: true; appointment: Appointment }
  | { success: false; reason: "NOT_FOUND" | "ALREADY_CANCELLED_BY_PRO" | "ALREADY_CANCELLED_BY_CLIENT" | "COMPLETED"; message: string; appointment?: Appointment };

export function lookupAppointmentForCancellation(code: string): CancelSearchResult {
  const cleanCode = code.trim().toUpperCase();
  const appointment = APPOINTMENTS_STORE.find(a => a.cancellation_code === cleanCode);

  if (!appointment) {
    return {
      success: false,
      reason: "NOT_FOUND",
      message: "No encontramos ningún turno con este código."
    };
  }

  if (appointment.status === "CANCELLED_BY_PRO") {
    return {
      success: false,
      reason: "ALREADY_CANCELLED_BY_PRO",
      message: `Este turno ya fue cancelado por el profesional/administrador.${appointment.cancel_reason ? ` Motivo: "${appointment.cancel_reason}".` : ""}`,
      appointment
    };
  }

  if (appointment.status === "CANCELLED_BY_CLIENT") {
    return {
      success: false,
      reason: "ALREADY_CANCELLED_BY_CLIENT",
      message: "Este turno ya ha sido cancelado previamente por el cliente.",
      appointment
    };
  }

  if (appointment.status === "COMPLETED") {
    return {
      success: false,
      reason: "COMPLETED",
      message: "Este turno ya fue completado.",
      appointment
    };
  }

  return {
    success: true,
    appointment
  };
}

export function cancelAppointmentByClient(code: string): { success: boolean; message: string } {
  const result = lookupAppointmentForCancellation(code);
  if (!result.success) {
    return { success: false, message: result.message };
  }

  result.appointment.status = "CANCELLED_BY_CLIENT";
  result.appointment.cancelled_at = new Date().toISOString();

  return { success: true, message: "Turno cancelado exitosamente por el cliente." };
}
