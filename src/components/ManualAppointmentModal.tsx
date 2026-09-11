"use client";

import { useState } from "react";
import { Service, Professional, Appointment, AppointmentSource } from "@/types";
import { formatPrice, generateCancellationCode } from "@/lib/utils";
import { X, Plus, Calendar, Clock, User, Phone, Mail, FileText } from "lucide-react";
import { format } from "date-fns";

interface ManualAppointmentModalProps {
  professionals: Professional[];
  services: Service[];
  defaultProfessionalId?: string;
  onClose: () => void;
  onSave: (appointment: Appointment) => void;
}

export default function ManualAppointmentModal({
  professionals,
  services,
  defaultProfessionalId,
  onClose,
  onSave
}: ManualAppointmentModalProps) {
  const [selectedProId, setSelectedProId] = useState(defaultProfessionalId || professionals[0]?.id || "");
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || "");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState("15:00");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [source, setSource] = useState<AppointmentSource>("MANUAL_WPP");
  const [notes, setNotes] = useState("");

  const selectedService = services.find(s => s.id === selectedServiceId);
  const selectedPro = professionals.find(p => p.id === selectedProId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedPro) return;

    const startDateTime = new Date(`${date}T${time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + selectedService.duration_minutes * 60000);

    const newAppointment: Appointment = {
      id: crypto.randomUUID(),
      cancellation_code: generateCancellationCode(),
      professional_id: selectedPro.id,
      service_id: selectedService.id,
      start_datetime: startDateTime.toISOString(),
      end_datetime: endDateTime.toISOString(),
      client_name: clientName,
      client_email: clientEmail || "sin-email@local.turnero",
      client_phone: clientPhone,
      status: "CONFIRMED",
      source: source,
      notes: notes || undefined,
      created_at: new Date().toISOString(),
      service: selectedService,
      professional: selectedPro
    };

    onSave(newAppointment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-md p-6 text-neutral-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold text-white mb-1">Cargar Turno Manual</h3>
        <p className="text-xs text-neutral-400 mb-4">Ingresa turnos que surjan de WhatsApp, Instagram o recepción</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Origen del Turno */}
          <div>
            <label className="block text-neutral-300 font-medium mb-1">Canal de origen</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "MANUAL_WPP", label: "WhatsApp" },
                { id: "MANUAL_IG", label: "Instagram" },
                { id: "MANUAL_LOCAL", label: "Presencial" },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSource(item.id as AppointmentSource)}
                  className={`py-2 rounded-xl border text-center transition-colors ${
                    source === item.id
                      ? "bg-emerald-500 text-neutral-950 font-semibold border-emerald-400"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Profesional */}
          <div>
            <label className="block text-neutral-300 font-medium mb-1">Profesional a cargo</label>
            <select
              value={selectedProId}
              onChange={(e) => setSelectedProId(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white focus:outline-none"
            >
              {professionals.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Servicio */}
          <div>
            <label className="block text-neutral-300 font-medium mb-1">Servicio</label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white focus:outline-none"
            >
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.duration_minutes}m - {formatPrice(s.price)})
                </option>
              ))}
            </select>
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Fecha</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Hora inicio</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Datos del Cliente */}
          <div className="space-y-2 pt-2 border-t border-neutral-800">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Nombre del cliente *</label>
              <input
                type="text"
                required
                placeholder="Nombre y apellido"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="+54 9 11..."
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Email (opcional)</label>
                <input
                  type="email"
                  placeholder="cliente@mail.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Notas / Motivo</label>
              <input
                type="text"
                placeholder="Ej. pidió confirmación telefónica previa"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold text-xs transition-all shadow-md shadow-emerald-500/20 mt-4"
          >
            Guardar Turno en Agenda
          </button>
        </form>
      </div>
    </div>
  );
}
