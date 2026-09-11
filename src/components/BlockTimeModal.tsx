"use client";

import { useState } from "react";
import { ScheduleOverride, Professional } from "@/types";
import { X, Lock } from "lucide-react";
import { format } from "date-fns";

interface BlockTimeModalProps {
  professionals: Professional[];
  defaultProfessionalId?: string;
  onClose: () => void;
  onSave: (override: ScheduleOverride) => void;
}

export default function BlockTimeModal({
  professionals,
  defaultProfessionalId,
  onClose,
  onSave
}: BlockTimeModalProps) {
  const [selectedProId, setSelectedProId] = useState(defaultProfessionalId || professionals[0]?.id || "");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [isFullDay, setIsFullDay] = useState(false);
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("18:00");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOverride: ScheduleOverride = {
      id: crypto.randomUUID(),
      professional_id: selectedProId,
      date: date,
      start_time: isFullDay ? undefined : startTime,
      end_time: isFullDay ? undefined : endTime,
      is_available: false,
      reason: reason || "Horario Bloqueado"
    };

    onSave(newOverride);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-sm p-6 text-neutral-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-amber-400 mb-1">
          <Lock className="w-5 h-5" />
          <h3 className="text-base font-semibold text-white">Bloquear Horario</h3>
        </div>
        <p className="text-xs text-neutral-400 mb-4">Evita que los clientes reserven en una fecha u horario</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-300 font-medium mb-1">Profesional</label>
            <select
              value={selectedProId}
              onChange={(e) => setSelectedProId(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-3 py-2 text-white focus:outline-none"
            >
              {professionals.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-neutral-300 font-medium mb-1">Fecha</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-3 py-2 text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="fullDay"
              checked={isFullDay}
              onChange={(e) => setIsFullDay(e.target.checked)}
              className="rounded bg-neutral-950 border-neutral-800 text-amber-500 focus:ring-0"
            />
            <label htmlFor="fullDay" className="text-neutral-300">Bloquear día completo</label>
          </div>

          {!isFullDay && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Desde</label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Hasta</label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-neutral-300 font-medium mb-1">Motivo (ej. Feriado, Médico, Personal)</label>
            <input
              type="text"
              placeholder="Motivo del bloqueo"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs transition-all shadow-md shadow-amber-500/20"
          >
            Confirmar Bloqueo
          </button>
        </form>
      </div>
    </div>
  );
}
