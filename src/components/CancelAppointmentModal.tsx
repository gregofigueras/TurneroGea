"use client";

import { useState } from "react";
import { lookupAppointmentForCancellation, cancelAppointmentByClient } from "@/lib/cancellation-service";
import { GEA_SERVICES, GEA_PROFESSIONALS } from "@/lib/mock-data";
import { Appointment } from "@/types";
import { ShieldAlert, CheckCircle2, Search, Info, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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

  // Enriquecer datos con servicio y profesional
  const service = foundAppointment ? GEA_SERVICES.find(s => s.id === foundAppointment.service_id) : null;
  const professional = foundAppointment ? GEA_PROFESSIONALS.find(p => p.id === foundAppointment.professional_id) : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#2a2732] border border-[#585e73]/40 rounded-3xl w-full max-w-sm p-6 text-[#f3f2f5] relative shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-xs text-[#897a9b] hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. ESTADO DE BÚSQUEDA */}
        {!foundAppointment && !errorMessage && !isCancelledSuccess && (
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="text-center">
              <h3 className="text-base font-semibold text-white">Cancelar un Turno</h3>
              <p className="text-xs text-[#897a9b] mt-1">Ingresa el código único que recibiste al reservar (ej. TRN-CONF)</p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-[#897a9b] absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                placeholder="TRN-XXXX"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full bg-[#1f1d24] border border-[#585e73]/40 focus:border-[#dedfab] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#897a9b] uppercase tracking-widest font-mono focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#6f6181] hover:bg-[#897a9b] text-white font-medium text-xs transition-colors shadow-md"
            >
              Buscar Turno
            </button>
          </form>
        )}

        {/* 2. ERROR / CASO TURNO YA CANCELADO POR EL PROFESIONAL O INEXISTENTE */}
        {errorMessage && !isCancelledSuccess && (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
              <Info className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">
                {isCancelledByPro ? "Turno ya cancelado por el Profesional" : "No es posible cancelar"}
              </h3>
              <p className="text-xs text-[#897a9b] mt-2 leading-relaxed bg-[#1f1d24] p-3 rounded-xl border border-[#585e73]/30">
                {errorMessage}
              </p>
            </div>

            <button
              onClick={() => {
                setErrorMessage(null);
                setFoundAppointment(null);
                setIsCancelledByPro(false);
              }}
              className="w-full py-2.5 rounded-xl bg-[#1f1d24] hover:bg-[#1f1d24]/80 text-[#897a9b] hover:text-white text-xs transition-colors"
            >
              Probar con otro código
            </button>
          </div>
        )}

        {/* 3. TURNO ENCONTRADO Y CONFIRMADO: PERMITE CANCELAR AL CLIENTE */}
        {foundAppointment && !errorMessage && !isCancelledSuccess && (
          <div className="space-y-4">
            <div className="text-center">
              <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <h3 className="text-base font-semibold text-white">¿Deseas cancelar tu turno?</h3>
              <p className="text-xs text-[#897a9b] mt-1">Código: <span className="font-mono text-[#dedfab]">{foundAppointment.cancellation_code}</span></p>
            </div>

            <div className="p-3 bg-[#1f1d24] rounded-xl text-xs space-y-1.5 text-neutral-300 border border-[#585e73]/30">
              <div className="flex justify-between">
                <span className="text-[#897a9b]">Tratamiento:</span>
                <span className="font-medium text-white">{service?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#897a9b]">Terapeuta:</span>
                <span className="font-medium text-white">{professional?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#897a9b]">Fecha y hora:</span>
                <span className="text-[#dedfab] font-semibold">
                  {format(new Date(foundAppointment.start_datetime), "dd/MM/yyyy HH:mm")} hs
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setFoundAppointment(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#1f1d24] text-xs text-[#897a9b] hover:text-white"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-semibold text-white shadow-md shadow-red-600/20"
              >
                Sí, cancelar turno
              </button>
            </div>
          </div>
        )}

        {/* 4. CANCELACIÓN EXITOSA */}
        {isCancelledSuccess && (
          <div className="text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-semibold text-white">Turno Cancelado</h3>
            <p className="text-xs text-[#897a9b]">
              El horario ha sido liberado en la agenda de Gea. ¡Muchas gracias por avisar!
            </p>
            <button
              onClick={onClose}
              className="w-full mt-2 py-2.5 rounded-xl bg-[#6f6181] hover:bg-[#897a9b] text-xs text-white"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
