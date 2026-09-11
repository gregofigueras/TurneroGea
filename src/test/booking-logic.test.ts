import { describe, it, expect } from "vitest";
import { formatPrice, generateCancellationCode } from "@/lib/utils";
import { getAvailableSlots } from "@/lib/booking-logic";
import { Appointment } from "@/types";
import { format } from "date-fns";

describe("Reglas de Negocio y Utilidades (Turnero Gea)", () => {
  it("Debe generar un código de cancelación con prefijo TRN- y 4 caracteres válidos", () => {
    const code = generateCancellationCode();
    expect(code).toMatch(/^TRN-[A-Z0-9]{4}$/);
  });

  it("Debe formatear el precio en moneda argentina ARS correctamente", () => {
    const formatted = formatPrice(38000);
    expect(formatted).toContain("38.000");
  });

  it("Debe calcular los slots de atención de 50 minutos para un profesional disponible", () => {
    const monday = new Date("2026-09-14T12:00:00");
    const slots = getAvailableSlots("p_ailin", monday, 50, []);
    
    expect(slots.length).toBeGreaterThan(0);
    expect(slots[0]).toHaveProperty("time");
    expect(slots[0].available).toBe(true);
  });

  it("Debe marcar como ocupado un slot si ya existe un turno confirmado en esa franja", () => {
    const monday = new Date("2026-09-14T12:00:00");
    const dateStr = format(monday, "yyyy-MM-dd");

    const existingAppointment: Appointment = {
      id: "test-app-1",
      cancellation_code: "TRN-TEST",
      professional_id: "p_ailin",
      service_id: "s_descontracturante",
      start_datetime: new Date(`${dateStr}T10:00:00`).toISOString(),
      end_datetime: new Date(`${dateStr}T10:50:00`).toISOString(),
      client_name: "Juan Perez",
      client_email: "juan@test.com",
      client_phone: "2235555555",
      status: "CONFIRMED",
      source: "ONLINE",
      created_at: new Date().toISOString()
    };

    const slots = getAvailableSlots("p_ailin", monday, 50, [existingAppointment]);
    const slotAt10 = slots.find(s => s.time === "10:00");

    expect(slotAt10).toBeDefined();
    expect(slotAt10?.available).toBe(false);
    expect(slotAt10?.reason).toBe("Ocupado");
  });

  it("No debe marcar ocupado si el turno fue CANCELLED_BY_PRO o CANCELLED_BY_CLIENT", () => {
    const monday = new Date("2026-09-14T12:00:00");
    const dateStr = format(monday, "yyyy-MM-dd");

    const cancelledAppointment: Appointment = {
      id: "test-app-2",
      cancellation_code: "TRN-CANC",
      professional_id: "p_ailin",
      service_id: "s_descontracturante",
      start_datetime: new Date(`${dateStr}T10:00:00`).toISOString(),
      end_datetime: new Date(`${dateStr}T10:50:00`).toISOString(),
      client_name: "Ana Gomez",
      client_email: "ana@test.com",
      client_phone: "2235555555",
      status: "CANCELLED_BY_PRO",
      source: "ONLINE",
      created_at: new Date().toISOString()
    };

    const slots = getAvailableSlots("p_ailin", monday, 50, [cancelledAppointment]);
    const slotAt10 = slots.find(s => s.time === "10:00");

    expect(slotAt10).toBeDefined();
    expect(slotAt10?.available).toBe(true);
  });
});
