"use client";

import { useState } from "react";
import Image from "next/image";
import { Service, Professional, Appointment } from "@/types";
import { GEA_SERVICES, GEA_PROFESSIONALS, GEA_INFO } from "@/lib/mock-data";
import { getAvailableSlots, TimeSlot } from "@/lib/booking-logic";
import { formatPrice, generateCancellationCode } from "@/lib/utils";
import { 
  Sparkles, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  MapPin,
  MessageCircle,
  Camera
} from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

export default function BookingFlow() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [activeCategory, setActiveCategory] = useState<"TODOS" | "MASAJES" | "HOLISTICAS">("TODOS");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  
  // Datos del cliente
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [notes, setNotes] = useState("");

  // Turno confirmado
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Filtrado de servicios por categoría
  const filteredServices = GEA_SERVICES.filter(service => {
    if (activeCategory === "MASAJES") return !['s_reiki', 's_presoterapia', 's_bioarmonizacion', 's_reflexologia'].includes(service.id);
    if (activeCategory === "HOLISTICAS") return ['s_reiki', 's_presoterapia', 's_bioarmonizacion', 's_reflexologia'].includes(service.id);
    return true;
  });

  // Profesionales que hacen este servicio
  const availableProfessionals = selectedService
    ? GEA_PROFESSIONALS.filter(p => p.services?.some(s => s.id === selectedService.id))
    : [];

  const nextDays = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const slots = (selectedProfessional && selectedService)
    ? getAvailableSlots(selectedProfessional.id, selectedDate, selectedService.duration_minutes, [])
    : [];

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedProfessional || !selectedSlot) return;

    const newAppointment: Appointment = {
      id: crypto.randomUUID(),
      cancellation_code: generateCancellationCode(),
      professional_id: selectedProfessional.id,
      service_id: selectedService.id,
      start_datetime: selectedSlot.datetime,
      end_datetime: new Date(new Date(selectedSlot.datetime).getTime() + selectedService.duration_minutes * 60000).toISOString(),
      client_name: clientName,
      client_email: clientEmail,
      client_phone: clientPhone,
      status: "CONFIRMED",
      source: "ONLINE",
      notes: notes || undefined,
      created_at: new Date().toISOString(),
      service: selectedService,
      professional: selectedProfessional
    };

    setConfirmedAppointment(newAppointment);
    setStep(5);
  };

  return (
    <div className="min-h-screen text-[#f3f2f5] flex flex-col items-center justify-start pb-20 px-4">
      {/* Header Gea con Logo Oficial */}
      <header className="w-full max-w-md pt-4 pb-4 flex flex-col items-center text-center">
        <div className="relative w-28 h-28 mb-1">
          <Image
            src="/gea-logo.png"
            alt="Gea Espacio de Bienestar"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-xl font-medium tracking-wide text-[#dedfab]">
          {GEA_INFO.name}
        </h1>
        <div className="flex items-center gap-1.5 text-xs text-[#897a9b] mt-1">
          <MapPin className="w-3.5 h-3.5 text-[#dedfab]" />
          <span>{GEA_INFO.address}</span>
        </div>

        {/* Barra de Progreso */}
        {step < 5 && (
          <div className="w-full mt-5 flex items-center justify-between gap-1.5 px-2">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  step >= i ? 'bg-[#dedfab] shadow-sm shadow-[#dedfab]/40' : 'bg-[#585e73]/40'
                }`}
              />
            ))}
          </div>
        )}
      </header>

      <main className="w-full max-w-md mt-3">
        {/* ============================================================ */}
        {/* PASO 1: SELECCIONAR SERVICIO */}
        {/* ============================================================ */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex justify-between items-end mb-1">
              <div>
                <h2 className="text-base font-semibold text-white">1. Elige tu tratamiento</h2>
                <p className="text-xs text-[#897a9b]">Sesiones de 50 minutos de relajación y bienestar</p>
              </div>
            </div>

            {/* Selector de Categorías */}
            <div className="flex gap-2 p-1 bg-[#1f1d24] border border-[#585e73]/30 rounded-2xl text-xs">
              {(["TODOS", "MASAJES", "HOLISTICAS"] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-1 py-1.5 rounded-xl font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-[#6f6181] text-white shadow-sm"
                      : "text-[#897a9b] hover:text-white"
                  }`}
                >
                  {cat === "TODOS" ? "Todos" : cat === "MASAJES" ? "Masajes" : "Holísticas"}
                </button>
              ))}
            </div>

            <div className="space-y-2.5">
              {filteredServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service);
                    setStep(2);
                  }}
                  className="w-full text-left p-4 rounded-2xl bg-[#2a2732]/70 border border-[#585e73]/30 hover:border-[#dedfab]/60 hover:bg-[#2a2732] transition-all group flex flex-col gap-2 relative shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-medium text-white group-hover:text-[#dedfab] transition-colors">
                      {service.name}
                    </h3>
                    <span className="text-sm font-bold text-[#dedfab] shrink-0">
                      {formatPrice(service.price)}
                    </span>
                  </div>

                  <p className="text-xs text-[#897a9b] line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-3 mt-1 text-[11px] text-[#897a9b]">
                    <span className="flex items-center gap-1 bg-[#1f1d24] px-2.5 py-1 rounded-lg border border-[#585e73]/30">
                      <Clock className="w-3 h-3 text-[#dedfab]" />
                      {service.duration_minutes} min
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PASO 2: SELECCIONAR PROFESIONAL */}
        {/* ============================================================ */}
        {step === 2 && selectedService && (
          <div className="space-y-4">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1 text-xs text-[#897a9b] hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Volver a tratamientos
            </button>

            <div>
              <h2 className="text-base font-semibold text-white">2. Selecciona terapeuta</h2>
              <p className="text-xs text-[#897a9b]">
                Especialistas disponibles para: <span className="text-[#dedfab] font-medium">{selectedService.name}</span>
              </p>
            </div>

            <div className="space-y-2.5">
              {availableProfessionals.map((pro) => (
                <button
                  key={pro.id}
                  onClick={() => {
                    setSelectedProfessional(pro);
                    setStep(3);
                  }}
                  className="w-full text-left p-4 rounded-2xl bg-[#2a2732]/70 border border-[#585e73]/30 hover:border-[#dedfab]/60 hover:bg-[#2a2732] transition-all flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#6f6181]/40 border border-[#897a9b]/40 flex items-center justify-center text-[#dedfab] font-semibold text-base shrink-0">
                    {pro.name[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white group-hover:text-[#dedfab] transition-colors">
                      {pro.name}
                    </h3>
                    <p className="text-xs text-[#897a9b] line-clamp-2 mt-0.5">
                      {pro.bio}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#897a9b] group-hover:text-[#dedfab] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PASO 3: SELECCIONAR FECHA Y HORA */}
        {/* ============================================================ */}
        {step === 3 && selectedProfessional && selectedService && (
          <div className="space-y-5">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-1 text-xs text-[#897a9b] hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Cambiar terapeuta
            </button>

            <div>
              <h2 className="text-base font-semibold text-white">3. Elige fecha y horario</h2>
              <p className="text-xs text-[#897a9b]">
                Atiende <span className="text-[#dedfab] font-medium">{selectedProfessional.name}</span> (50 min)
              </p>
            </div>

            {/* Días */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {nextDays.map((day) => {
                const isSelected = isSameDay(day, selectedDate);
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => {
                      setSelectedDate(day);
                      setSelectedSlot(null);
                    }}
                    className={`flex-shrink-0 flex flex-col items-center justify-center w-16 py-3 rounded-2xl border transition-all ${
                      isSelected
                        ? "bg-[#dedfab] text-[#1f1d24] border-[#dedfab] font-bold shadow-md shadow-[#dedfab]/20"
                        : "bg-[#2a2732]/70 border-[#585e73]/30 text-[#897a9b] hover:border-[#897a9b]"
                    }`}
                  >
                    <span className="text-[11px] uppercase tracking-wider">
                      {format(day, "EEE", { locale: es })}
                    </span>
                    <span className="text-lg font-bold mt-0.5">
                      {format(day, "d")}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Horarios */}
            <div>
              <p className="text-xs font-medium text-[#897a9b] mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#dedfab]" />
                Horarios disponibles para {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}:
              </p>

              {slots.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#2a2732]/70 border border-[#585e73]/30 text-center">
                  <p className="text-xs text-[#897a9b]">
                    {selectedProfessional.name} no tiene disponibilidad para este día.
                  </p>
                  <p className="text-xs text-[#dedfab] mt-1">Por favor elige otra fecha arriba.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2.5">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2.5 rounded-xl text-xs font-medium border transition-all ${
                        !slot.available
                          ? "bg-[#1f1d24] border-[#585e73]/20 text-neutral-600 line-through cursor-not-allowed"
                          : selectedSlot?.time === slot.time
                          ? "bg-[#dedfab] border-[#dedfab] text-[#1f1d24] font-bold shadow-md shadow-[#dedfab]/30"
                          : "bg-[#2a2732]/70 border-[#585e73]/30 text-[#f3f2f5] hover:border-[#dedfab]/50"
                      }`}
                    >
                      {slot.time} hs
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedSlot && (
              <button
                onClick={() => setStep(4)}
                className="w-full mt-4 py-3.5 rounded-2xl bg-[#dedfab] hover:bg-[#dedfab]/90 text-[#1f1d24] font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#dedfab]/20 flex items-center justify-center gap-2"
              >
                Continuar con {selectedSlot.time} hs <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* PASO 4: DATOS DE CONTACTO */}
        {/* ============================================================ */}
        {step === 4 && selectedService && selectedProfessional && selectedSlot && (
          <form onSubmit={handleConfirmBooking} className="space-y-4">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex items-center gap-1 text-xs text-[#897a9b] hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Cambiar horario
            </button>

            <div>
              <h2 className="text-base font-semibold text-white">4. Tus datos</h2>
              <p className="text-xs text-[#897a9b]">Para enviarte la confirmación y el recordatorio</p>
            </div>

            {/* Resumen */}
            <div className="p-3.5 rounded-2xl bg-[#2a2732]/80 border border-[#585e73]/30 text-xs space-y-1.5">
              <div className="flex justify-between font-medium text-white">
                <span>{selectedService.name}</span>
                <span className="text-[#dedfab] font-bold">{formatPrice(selectedService.price)}</span>
              </div>
              <div className="flex justify-between text-[#897a9b]">
                <span>Terapeuta: {selectedProfessional.name}</span>
                <span>{selectedSlot.time} hs ({format(selectedDate, "dd/MM")})</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1">Nombre y Apellido *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#897a9b] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Ej. Sofía Rossi"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-[#1f1d24] border border-[#585e73]/40 focus:border-[#dedfab] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#897a9b] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1">WhatsApp / Celular *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#897a9b] absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 223 543 8952"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-[#1f1d24] border border-[#585e73]/40 focus:border-[#dedfab] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#897a9b] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1">Email * (para confirmación y recordatorio)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#897a9b] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="tuemail@ejemplo.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-[#1f1d24] border border-[#585e73]/40 focus:border-[#dedfab] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#897a9b] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1">¿Alguna indicación o molestia puntual?</label>
                <textarea
                  rows={2}
                  placeholder="Ej. Contractura en trapecio, dolor lumbar, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#1f1d24] border border-[#585e73]/40 focus:border-[#dedfab] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#897a9b] focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#dedfab] hover:bg-[#dedfab]/90 text-[#1f1d24] font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#dedfab]/20 mt-4"
            >
              Confirmar Turno
            </button>
          </form>
        )}

        {/* ============================================================ */}
        {/* PASO 5: CONFIRMACIÓN Y CÓDIGO */}
        {/* ============================================================ */}
        {step === 5 && confirmedAppointment && (
          <div className="p-6 rounded-3xl bg-[#2a2732] border border-[#585e73]/40 text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-[#dedfab]/20 border border-[#dedfab]/40 text-[#dedfab] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">¡Turno Agendado con Éxito!</h2>
              <p className="text-xs text-[#897a9b] mt-1">
                Te esperamos en <span className="text-[#dedfab] font-medium">{GEA_INFO.address}</span> el {format(new Date(confirmedAppointment.start_datetime), "EEEE d 'de' MMMM", { locale: es })} a las {format(new Date(confirmedAppointment.start_datetime), "HH:mm")} hs.
              </p>
            </div>

            {/* Código de Cancelación */}
            <div className="p-4 rounded-2xl bg-[#1f1d24] border border-[#585e73]/30">
              <span className="text-[10px] uppercase font-semibold text-[#897a9b] tracking-wider block">
                Tu Código Único de Cancelación
              </span>
              <span className="text-2xl font-mono font-bold tracking-widest text-[#dedfab] block my-1">
                {confirmedAppointment.cancellation_code}
              </span>
              <p className="text-[11px] text-[#897a9b]">
                Guarda este código para cancelar o modificar tu turno fácilmente desde la web.
              </p>
            </div>

            {/* Detalle */}
            <div className="text-left text-xs space-y-2 border-t border-[#585e73]/30 pt-4 text-neutral-300">
              <div className="flex justify-between">
                <span className="text-[#897a9b]">Tratamiento:</span>
                <span className="font-medium text-white">{confirmedAppointment.service?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#897a9b]">Terapeuta:</span>
                <span className="font-medium text-white">{confirmedAppointment.professional?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#897a9b]">Abonas al asistir:</span>
                <span className="font-bold text-[#dedfab]">
                  {confirmedAppointment.service && formatPrice(confirmedAppointment.service.price)}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setStep(1);
                  setSelectedService(null);
                  setSelectedProfessional(null);
                  setSelectedSlot(null);
                  setConfirmedAppointment(null);
                }}
                className="w-full py-3 rounded-xl bg-[#6f6181] hover:bg-[#897a9b] text-white text-xs font-medium transition-colors"
              >
                Agendar otro turno
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Gea con Redes Sociales y WhatsApp */}
      <footer className="w-full max-w-md mt-10 pt-6 border-t border-[#585e73]/30 flex flex-col items-center gap-3 text-xs text-[#897a9b]">
        <div className="flex items-center gap-4">
          <a
            href={GEA_INFO.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-[#dedfab] transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[#dedfab]" /> {GEA_INFO.whatsapp}
          </a>
          <a
            href={GEA_INFO.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-[#dedfab] transition-colors"
          >
            <Camera className="w-4 h-4 text-[#dedfab]" /> @{GEA_INFO.instagram}
          </a>
        </div>
        <p className="text-[11px] text-[#585e73]">
          {GEA_INFO.name} • {GEA_INFO.address}
        </p>
      </footer>
    </div>
  );
}
