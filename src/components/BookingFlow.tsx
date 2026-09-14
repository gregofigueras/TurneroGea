"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Service, Professional, Appointment } from "@/types";
import { GEA_SERVICES, GEA_PROFESSIONALS, GEA_INFO } from "@/lib/mock-data";
import { getAvailableSlots, TimeSlot } from "@/lib/booking-logic";
import { formatPrice, generateCancellationCode, resetHoverState } from "@/lib/utils";
import {
  Button,
  Input,
  Textarea,
  StatePoints,
  ServiceCard,
  ProfessionalCard,
  CalendarDay,
  TimeSlotButton,
  InfoLabel,
} from "@/components/ui";
import {
  Clock,
  User,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle2,
  ChevronLeft,
  MapPin,
  MessageCircle,
  Camera,
} from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

const HOLISTIC_IDS = ["s_reiki", "s_presoterapia", "s_bioarmonizacion", "s_reflexologia"];

const AVATAR_COLORS = ["bg-primary", "bg-tertiary", "bg-surface", "bg-secondary"];

function ProfessionalAvatar({ name, index }: { name: string; index: number }) {
  const bg = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const isDark = bg === "bg-secondary";
  return (
    <div className={`w-full h-full flex items-center justify-center ${bg}`}>
      <span className={`text-2xl font-bold ${isDark ? "text-tertiary" : "text-secondary"}`}>
        {name[0]}
      </span>
    </div>
  );
}

export default function BookingFlow() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [activeCategory, setActiveCategory] = useState<"MASAJES" | "HOLISTICAS">("MASAJES");
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

  // Evita que una card quede "pegada" en su estado hover cuando el listado
  // se reordena debajo del cursor tras cambiar de paso, categoría o fecha.
  useEffect(() => {
    resetHoverState();
  }, [step, activeCategory, selectedDate]);

  const filteredServices = GEA_SERVICES.filter((service) =>
    activeCategory === "HOLISTICAS" ? HOLISTIC_IDS.includes(service.id) : !HOLISTIC_IDS.includes(service.id)
  );

  const availableProfessionals = selectedService
    ? GEA_PROFESSIONALS.filter((p) => p.services?.some((s) => s.id === selectedService.id))
    : [];

  const nextDays = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

  const slotsByDay = new Map<string, TimeSlot[]>();
  if (selectedProfessional && selectedService) {
    nextDays.forEach((day) => {
      slotsByDay.set(
        format(day, "yyyy-MM-dd"),
        getAvailableSlots(selectedProfessional.id, day, selectedService.duration_minutes, [])
      );
    });
  }
  const slots = slotsByDay.get(format(selectedDate, "yyyy-MM-dd")) ?? [];

  const isFormValid =
    clientName.trim().length > 1 &&
    clientPhone.trim().length > 5 &&
    /^\S+@\S+\.\S+$/.test(clientEmail.trim());

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedProfessional || !selectedSlot || !isFormValid) return;

    const newAppointment: Appointment = {
      id: crypto.randomUUID(),
      cancellation_code: generateCancellationCode(),
      professional_id: selectedProfessional.id,
      service_id: selectedService.id,
      start_datetime: selectedSlot.datetime,
      end_datetime: new Date(
        new Date(selectedSlot.datetime).getTime() + selectedService.duration_minutes * 60000
      ).toISOString(),
      client_name: clientName,
      client_email: clientEmail,
      client_phone: clientPhone,
      status: "CONFIRMED",
      source: "ONLINE",
      notes: notes || undefined,
      created_at: new Date().toISOString(),
      service: selectedService,
      professional: selectedProfessional,
    };

    setConfirmedAppointment(newAppointment);
    setStep(5);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pb-16 px-4 sm:px-5 lg:px-8">
      {/* Header */}
      <header className="w-full max-w-md lg:max-w-3xl pt-6 pb-4 flex flex-col items-center text-center">
        <div className="relative w-28 h-14 mb-1">
          <Image src="/gea-logo.png" alt="Gea Espacio de Bienestar" fill className="object-contain" priority />
        </div>
        <h1 className="text-[28px] font-semibold leading-tight text-text-primary">GEA</h1>
        <p className="text-lg font-semibold text-text-primary -mt-1">Espacio de bienestar</p>

        <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-1.5">
          <MapPin className="w-3.5 h-3.5" />
          <span>{GEA_INFO.address}</span>
        </div>

        <div className="w-full h-px bg-secondary/15 mt-5" />

        {step < 5 && (
          <div className="w-full mt-5 flex flex-col items-center gap-4">
            <h2 className="text-2xl font-semibold tracking-wide text-text-primary">OBTENER TURNO</h2>
            <StatePoints total={4} current={step} />
          </div>
        )}
      </header>

      <main className="w-full max-w-md lg:max-w-3xl mt-2 flex flex-col gap-6">
        {/* ============================================================ */}
        {/* PASO 1: SELECCIONAR TRATAMIENTO */}
        {/* ============================================================ */}
        {step === 1 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-text-primary">1. Elige el tratamiento</h2>

            <div className="flex gap-1 p-1 bg-white border border-secondary/10 rounded-xl text-sm shadow-card">
              {(["MASAJES", "HOLISTICAS"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-secondary text-white"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {cat === "MASAJES" ? "Masajes" : "Holísticos"}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 mt-1">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  name={service.name}
                  description={service.description}
                  duration={service.duration_minutes}
                  price={formatPrice(service.price)}
                  selected={selectedService?.id === service.id}
                  onClick={() => {
                    setSelectedService(service);
                    setSelectedProfessional(null);
                    setStep(2);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PASO 2: SELECCIONAR PROFESIONAL */}
        {/* ============================================================ */}
        {step === 2 && selectedService && (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors w-fit"
            >
              <ChevronLeft className="w-4 h-4" /> Volver a tratamientos
            </button>

            <h2 className="text-lg font-semibold text-text-primary">2. Elige el profesional</h2>

            <div className="grid grid-cols-2 gap-3">
              {availableProfessionals.map((pro, i) => (
                <ProfessionalCard
                  key={pro.id}
                  name={pro.name}
                  specialty={pro.bio}
                  selected={selectedProfessional?.id === pro.id}
                  avatar={<ProfessionalAvatar name={pro.name} index={i} />}
                  onClick={() => {
                    setSelectedProfessional(pro);
                    setSelectedSlot(null);
                    setStep(3);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PASO 3: SELECCIONAR FECHA Y HORARIO */}
        {/* ============================================================ */}
        {step === 3 && selectedProfessional && selectedService && (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors w-fit"
            >
              <ChevronLeft className="w-4 h-4" /> Cambiar profesional
            </button>

            <h2 className="text-lg font-semibold text-text-primary">3. Elige fecha y horario</h2>

            <div className="relative">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {nextDays.map((day) => {
                  const key = format(day, "yyyy-MM-dd");
                  const dayHasSlots = (slotsByDay.get(key) ?? []).length > 0;
                  return (
                    <CalendarDay
                      key={key}
                      weekday={format(day, "EEE", { locale: es })}
                      day={format(day, "d")}
                      selected={isSameDay(day, selectedDate)}
                      disabled={!dayHasSlots}
                      onClick={() => {
                        setSelectedDate(day);
                        setSelectedSlot(null);
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-sm text-text-secondary mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Horarios disponibles para {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
              </p>

              {slots.length === 0 ? (
                <div className="p-6 rounded-lg bg-white border border-secondary/10 text-center shadow-card">
                  <p className="text-xs text-text-secondary">
                    {selectedProfessional.name} no tiene disponibilidad para este día.
                  </p>
                  <p className="text-xs text-text-primary mt-1">Por favor elige otra fecha arriba.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2.5">
                  {slots.map((slot) => (
                    <TimeSlotButton
                      key={slot.time}
                      time={`${slot.time} hs`}
                      disabled={!slot.available}
                      selected={selectedSlot?.time === slot.time}
                      onClick={() => setSelectedSlot(slot)}
                    />
                  ))}
                </div>
              )}
            </div>

            <Button disabled={!selectedSlot} onClick={() => setStep(4)} className="mt-1">
              Confirmar
            </Button>
          </div>
        )}

        {/* ============================================================ */}
        {/* PASO 4: DATOS DE CONTACTO */}
        {/* ============================================================ */}
        {step === 4 && selectedService && selectedProfessional && selectedSlot && (
          <form onSubmit={handleConfirmBooking} className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors w-fit"
            >
              <ChevronLeft className="w-4 h-4" /> Cambiar horario
            </button>

            <div>
              <h2 className="text-lg font-semibold text-text-primary">4. Completa tus datos</h2>
              <p className="text-xs text-text-secondary mt-0.5">Para recibir la confirmación y el recordatorio.</p>
            </div>

            <div className="flex flex-col gap-3">
              <Input
                id="clientName"
                label="Nombre y Apellido"
                icon={<User className="w-4 h-4" />}
                required
                placeholder="Ej. Sofía Rossi"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
              <Input
                id="clientEmail"
                type="email"
                label="Mail"
                icon={<Mail className="w-4 h-4" />}
                required
                placeholder="tuemail@ejemplo.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
              />
              <Input
                id="clientPhone"
                type="tel"
                label="WhatsApp/Telefono"
                icon={<Phone className="w-4 h-4" />}
                required
                placeholder="Ej. 223 543 8952"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
              />
              <Textarea
                id="notes"
                label="¿Alguna indicación o molestia puntual?"
                icon={<MessageSquare className="w-4 h-4" />}
                rows={2}
                placeholder="Ej. Contractura en trapecio, dolor lumbar, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 mt-1">
              <span className="w-fit bg-secondary text-tertiary text-xs font-medium rounded-lg px-2.5 py-1.5">
                {selectedService.name} - {formatPrice(selectedService.price)}
              </span>
              <span className="w-fit bg-secondary text-tertiary text-xs font-medium rounded-lg px-2.5 py-1.5">
                {selectedProfessional.name}
              </span>
              <span className="w-fit bg-secondary text-tertiary text-xs font-medium rounded-lg px-2.5 py-1.5">
                {format(selectedDate, "EEEE d", { locale: es })} - {selectedSlot.time}hs
              </span>
            </div>

            <Button type="submit" disabled={!isFormValid} className="mt-1">
              Confirmar
            </Button>
          </form>
        )}

        {/* ============================================================ */}
        {/* PASO 5: CONFIRMACIÓN */}
        {/* ============================================================ */}
        {step === 5 && confirmedAppointment && (
          <div className="p-6 rounded-lg bg-surface text-center flex flex-col items-center gap-4 shadow-card">
            <div className="w-16 h-16 rounded-full bg-white/60 border border-secondary/20 text-secondary flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-semibold text-text-primary">¡Turno agendado con éxito!</h2>

            <div>
              <p className="text-xs text-text-secondary">Tu Código Único de Cancelación:</p>
              <p className="text-2xl font-mono font-bold tracking-widest text-success my-1">
                {confirmedAppointment.cancellation_code}
              </p>
              <p className="text-xs text-text-secondary">
                Guarda este código para cancelar o modificar tu turno fácilmente desde la web.
              </p>
            </div>

            <div className="w-full flex flex-col gap-2.5 text-left mt-1">
              <InfoLabel label="Tratamiento" value={`${confirmedAppointment.service?.name} - ${formatPrice(confirmedAppointment.service?.price ?? 0)}`} />
              <InfoLabel label="Profesional" value={confirmedAppointment.professional?.name ?? ""} />
              <InfoLabel
                label="Fecha y hora"
                value={`${format(new Date(confirmedAppointment.start_datetime), "EEEE d", { locale: es })} - ${format(
                  new Date(confirmedAppointment.start_datetime),
                  "HH:mm"
                )}hs`}
              />
              <InfoLabel label="Duración" value={`${confirmedAppointment.service?.duration_minutes}min`} />
            </div>

            <Button
              variant="secondary"
              onClick={() => {
                setStep(1);
                setSelectedService(null);
                setSelectedProfessional(null);
                setSelectedSlot(null);
                setConfirmedAppointment(null);
                setClientName("");
                setClientPhone("");
                setClientEmail("");
                setNotes("");
              }}
              className="mt-2"
            >
              Agendar otro turno
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-md lg:max-w-3xl mt-10 pt-6 border-t border-secondary/15 flex flex-col items-center gap-3 text-xs text-text-secondary">
        <div className="flex items-center gap-4">
          <a
            href={GEA_INFO.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-text-primary transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> {GEA_INFO.whatsapp}
          </a>
          <a
            href={GEA_INFO.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-text-primary transition-colors"
          >
            <Camera className="w-4 h-4" /> @{GEA_INFO.instagram}
          </a>
        </div>
        <p className="text-[11px] text-text-secondary/70">
          {GEA_INFO.name} • {GEA_INFO.address}
        </p>
      </footer>
    </div>
  );
}
