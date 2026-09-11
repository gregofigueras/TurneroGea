import { describe, it, expect } from "vitest";
import { GEA_SERVICES, GEA_PROFESSIONALS } from "@/lib/mock-data";

describe("Validación de Requerimientos Gea Espacio de Bienestar", () => {
  it("Todos los servicios deben durar exactamente 50 minutos según requerimiento", () => {
    GEA_SERVICES.forEach(service => {
      expect(service.duration_minutes).toBe(50);
    });
  });

  it("El Masaje Deportivo solo debe ser prestado por Mauro", () => {
    const deportivo = GEA_SERVICES.find(s => s.id === "s_deportivo");
    expect(deportivo).toBeDefined();

    const prosForDeportivo = GEA_PROFESSIONALS.filter(p => 
      p.services?.some(s => s.id === "s_deportivo")
    );

    expect(prosForDeportivo.length).toBe(1);
    expect(prosForDeportivo[0].name).toBe("Mauro");
  });

  it("El Masaje Descontracturante debe ser prestado por Ailin, Patricia, Sofía y Natali", () => {
    const pros = GEA_PROFESSIONALS
      .filter(p => p.services?.some(s => s.id === "s_descontracturante"))
      .map(p => p.name)
      .sort();

    expect(pros).toEqual(["Ailin", "Natali", "Patricia", "Sofía"].sort());
  });

  it("La sesión de Reiki debe ser prestada por Ailin e Ivana", () => {
    const pros = GEA_PROFESSIONALS
      .filter(p => p.services?.some(s => s.id === "s_reiki"))
      .map(p => p.name)
      .sort();

    expect(pros).toEqual(["Ailin", "Ivana"].sort());
  });

  it("El drenaje con botas de presoterapia debe tener precio $45.000 y ser de Patricia", () => {
    const presoterapia = GEA_SERVICES.find(s => s.id === "s_presoterapia");
    expect(presoterapia?.price).toBe(45000);

    const pros = GEA_PROFESSIONALS.filter(p => p.services?.some(s => s.id === "s_presoterapia"));
    expect(pros.length).toBe(1);
    expect(pros[0].name).toBe("Patricia");
  });
});
