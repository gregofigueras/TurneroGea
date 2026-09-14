"use client";

import { useState } from "react";
import { lookupAppointmentForCancellation, cancelAppointmentByClient } from "@/lib/cancellation-service";
import { GEA_SERVICES, GEA_PROFESSIONALS } from "@/lib/mock-data";
import { Appointment } from "@/types";
import { Button, Input, InfoLabel } from "@/components/ui";
import { ShieldAlert, CheckCircle2, Search, Info, X } from "lucide-react";
import { format } from "date-fns";

export default function CancelAppointmentModal({ onClose }: { onClose: () => void }) {
  const [code, setCode] = useState("");
  const [foundAppointment, setFoundAppointment] = useState<Appointment | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCancelledByPro, setIsCancelledByPro] = useState(false);
  const [isCancelledSuccess, setIsCancelledSuccess] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setErrorMessage(null);
    setIsCancelledByPro(false);

    const result = lookupAppointmentForCancellation(code);

    if (!result.success) {
      if (result.reason === "ALREADY_CANCELLED_BY_PRO") {
        setIsCancelledByPro(true);
      }
      setErrorMessage(result.message);
      setFoundAppointment(result.appointment || null);
    } else {
      setFoundAppointment(result.appointment);
    }
  };

  const handleConfirmCancel = () => {
    if (!foundAppointment) return;

    const res = cancelAppointmentByClient(foundAppointment.cancellation_code);
    if (res.success) {
      setIsCancelledSuccess(true);
    } else {
      setErrorMessage(res.message);
    }
  };

  const service = foundAppointment ? GEA_SERVICES.find((s) => s.id === foundAppointment.service_id) : null;
  const professional = foundAppointment ? GEA_PROFESSIONALS.find((p) => p.id === foundAppointment.professional_id) : null;

  return (
    <div className="fixed inset-0 z-50 bg-secondary/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background border border-secondary/10 rounded-lg w-full max-w-sm p-6 text-text-primary relative shadow-card">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. ESTADO DE BÚSQUEDA */}
        {!foundAppointment && !errorMessage && !isCancelledSuccess && (
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-text-primary">Cancelar un Turno</h3>
              <p className="text-xs text-text-secondary mt-1">
                Ingresa el código único que recibiste al reservar (ej. TRN-CONF)
              </p>
            </div>

            <Input
              icon={<Search className="w-4 h-4" />}
              required
              placeholder="TRN-XXXX"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="uppercase tracking-widest font-mono"
            />

            <Button type="submit">Buscar Turno</Button>
          </form>
        )}

        {/* 2. ERROR / TURNO YA CANCELADO POR EL PROFESIONAL O INEXISTENTE */}
        {errorMessage && !isCancelledSuccess && (
          <div className="flex flex-col gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-warning/15 text-warning flex items-center justify-center mx-auto">
              <Info className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                {isCancelledByPro ? "Turno ya cancelado por el Profesional" : "No es posible cancelar"}
              </h3>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed bg-white p-3 rounded-lg border border-secondary/10">
                {errorMessage}
              </p>
            </div>

            <Button
              variant="secondary"
              onClick={() => {
                setErrorMessage(null);
                setFoundAppointment(null);
                setIsCancelledByPro(false);
              }}
            >
              Probar con otro código
            </Button>
          </div>
        )}

        {/* 3. TURNO ENCONTRADO: PERMITE CANCELAR AL CLIENTE */}
        {foundAppointment && !errorMessage && !isCancelledSuccess && (
          <div className="flex flex-col gap-4">
            <div className="text-center">
              <ShieldAlert className="w-8 h-8 text-warning mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-text-primary">¿Deseas cancelar tu turno?</h3>
              <p className="text-xs text-text-secondary mt-1">
                Código: <span className="font-mono text-text-primary">{foundAppointment.cancellation_code}</span>
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-secondary/10 flex flex-col gap-2">
              <InfoLabel label="Tratamiento" value={service?.name ?? ""} />
              <InfoLabel label="Profesional" value={professional?.name ?? ""} />
              <InfoLabel
                label="Fecha y hora"
                value={`${format(new Date(foundAppointment.start_datetime), "dd/MM/yyyy HH:mm")}hs`}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setFoundAppointment(null)}>
                Volver
              </Button>
              <Button
                onClick={handleConfirmCancel}
                className="bg-error hover:bg-error/90"
              >
                Sí, cancelar turno
              </Button>
            </div>
          </div>
        )}

        {/* 4. CANCELACIÓN EXITOSA */}
        {isCancelledSuccess && (
          <div className="text-center flex flex-col gap-3">
            <CheckCircle2 className="w-10 h-10 text-success mx-auto" />
            <h3 className="text-lg font-semibold text-text-primary">Turno Cancelado</h3>
            <p className="text-xs text-text-secondary">
              El horario ha sido liberado en la agenda de Gea. ¡Muchas gracias por avisar!
            </p>
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
