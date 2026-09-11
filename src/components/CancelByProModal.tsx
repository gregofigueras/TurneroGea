"use client";

import { useState } from "react";
import { Appointment } from "@/types";
import { X, AlertTriangle } from "lucide-react";

interface CancelByProModalProps {
  appointment: Appointment;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function CancelByProModal({ appointment, onClose, onConfirm }: CancelByProModalProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirm(reason);
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

        <div className="text-center space-y-2 mb-4">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
          <h3 className="text-base font-semibold text-white">Cancelar Turno</h3>
          <p className="text-xs text-neutral-400">
            Cliente: <span className="text-white font-medium">{appointment.client_name}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-300 font-medium mb-1">
              Motivo de la cancelación * (Queda registrado para auditoría)
            </label>
            <textarea
              required
              rows={3}
              placeholder="Ej. Imprevisto personal del profesional / Desperfecto en consultorio"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl p-3 text-white placeholder-neutral-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white"
            >
              Atrás
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold shadow-md shadow-red-600/20"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
