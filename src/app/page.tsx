"use client";

import { useState } from "react";
import BookingFlow from "@/components/BookingFlow";
import CancelAppointmentModal from "@/components/CancelAppointmentModal";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Home() {
  const [showCancelModal, setShowCancelModal] = useState(false);

  return (
    <div className="relative min-h-screen bg-neutral-950">
      {/* Botones auxiliares superiores (Cancelar turno / Acceso staff) */}
      <div className="w-full max-w-md mx-auto px-4 pt-4 flex justify-between items-center text-xs text-neutral-400">
        <button
          onClick={() => setShowCancelModal(true)}
          className="hover:text-red-400 transition-colors underline underline-offset-4"
        >
          ¿Ya tienes turno? Cancelar aquí
        </button>

        <Link
          href="/admin"
          className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Acceso Staff
        </Link>
      </div>

      <BookingFlow />

      {showCancelModal && (
        <CancelAppointmentModal onClose={() => setShowCancelModal(false)} />
      )}
    </div>
  );
}
