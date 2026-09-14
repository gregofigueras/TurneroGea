"use client";

import { useState } from "react";
import BookingFlow from "@/components/BookingFlow";
import CancelAppointmentModal from "@/components/CancelAppointmentModal";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Home() {
  const [showCancelModal, setShowCancelModal] = useState(false);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Botones auxiliares superiores (Cancelar turno / Acceso staff) */}
      <div className="w-full max-w-md lg:max-w-3xl mx-auto px-4 sm:px-5 lg:px-8 pt-4 flex justify-between items-center text-xs text-text-secondary">
        <button
          onClick={() => setShowCancelModal(true)}
          className="hover:text-error transition-colors underline underline-offset-4"
        >
          ¿Ya tienes turno? Cancelar aquí
        </button>

        <Link
          href="/login"
          className="flex items-center gap-1 hover:text-text-primary transition-colors"
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
