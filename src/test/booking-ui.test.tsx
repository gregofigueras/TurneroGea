import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import BookingFlow from "@/components/BookingFlow";

describe("Componente BookingFlow (Interacción de Usuario)", () => {
  it("Debe renderizar el título de Gea y la lista de servicios", () => {
    render(<BookingFlow />);
    expect(screen.getByText("Gea Espacio de Bienestar")).toBeInTheDocument();
    expect(screen.getByText("1. Elige tu tratamiento")).toBeInTheDocument();
    expect(screen.getByText("Masaje Descontracturante")).toBeInTheDocument();
  });

  it("Debe filtrar por categoría Masajes y Holísticas", () => {
    render(<BookingFlow />);
    const holisticaBtn = screen.getByText("Holísticas");
    fireEvent.click(holisticaBtn);

    expect(screen.getByText("Sesión de Reiki")).toBeInTheDocument();
    expect(screen.queryByText("Masaje Deportivo")).not.toBeInTheDocument();
  });

  it("Al seleccionar un servicio, debe pasar al paso 2 y mostrar solo los profesionales habilitados", () => {
    render(<BookingFlow />);
    const servicioBtn = screen.getByText("Masaje Deportivo");
    fireEvent.click(servicioBtn);

    // Debe mostrar paso 2
    expect(screen.getByText("2. Selecciona terapeuta")).toBeInTheDocument();
    // En deportivo solo atiende Mauro
    expect(screen.getByText("Mauro")).toBeInTheDocument();
    expect(screen.queryByText("Ailin")).not.toBeInTheDocument();
  });
});
