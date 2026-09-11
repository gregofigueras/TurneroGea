import { describe, it, expect, beforeEach } from "vitest";
import { 
  lookupAppointmentForCancellation, 
  cancelAppointmentByClient, 
  APPOINTMENTS_STORE 
} from "@/lib/cancellation-service";

describe("Validación de Cancelación: Regla Profesional vs Cliente", () => {
  it("Si el turno fue cancelado por el profesional (CANCELLED_BY_PRO), el cliente NO lo puede cancelar", () => {
    // TRN-PRO1 tiene status 'CANCELLED_BY_PRO' y motivo registrado
    const result = lookupAppointmentForCancellation("TRN-PRO1");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe("ALREADY_CANCELLED_BY_PRO");
      expect(result.message).toContain("cancelado por el profesional/administrador");
      expect(result.message).toContain("Urgencia médica del profesional");
    }

    // Si intenta forzar la cancelación:
    const cancelAttempt = cancelAppointmentByClient("TRN-PRO1");
    expect(cancelAttempt.success).toBe(false);
    expect(cancelAttempt.message).toContain("cancelado por el profesional/administrador");
  });

  it("Si el turno ya fue cancelado antes por el cliente (CANCELLED_BY_CLIENT), no permite duplicar cancelación", () => {
    const result = lookupAppointmentForCancellation("TRN-CLI1");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe("ALREADY_CANCELLED_BY_CLIENT");
    }

    const cancelAttempt = cancelAppointmentByClient("TRN-CLI1");
    expect(cancelAttempt.success).toBe(false);
  });

  it("Si el turno está CONFIRMED, el cliente sí puede cancelarlo y su estado cambia a CANCELLED_BY_CLIENT", () => {
    // TRN-CONF está confirmado
    const lookup = lookupAppointmentForCancellation("TRN-CONF");
    expect(lookup.success).toBe(true);

    const cancelResult = cancelAppointmentByClient("TRN-CONF");
    expect(cancelResult.success).toBe(true);

    // Ahora volvemos a buscarlo y ya no debe dejar cancelarlo otra vez
    const postLookup = lookupAppointmentForCancellation("TRN-CONF");
    expect(postLookup.success).toBe(false);
    if (!postLookup.success) {
      expect(postLookup.reason).toBe("ALREADY_CANCELLED_BY_CLIENT");
    }
  });

  it("Si el código no existe, devuelve NOT_FOUND", () => {
    const result = lookupAppointmentForCancellation("TRN-INVENTADO");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe("NOT_FOUND");
    }
  });
});
