"use client";

import { useState } from "react";
import { 
  Appointment, 
  Professional, 
  Service, 
  ScheduleOverride, 
  UserRole 
} from "@/types";
import { MOCK_PROFESSIONALS, MOCK_SERVICES } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";
import ManualAppointmentModal from "@/components/ManualAppointmentModal";
import BlockTimeModal from "@/components/BlockTimeModal";
import CancelByProModal from "@/components/CancelByProModal";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Lock, 
  User, 
  Phone, 
  Filter, 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MessageCircle,
  Camera,
  Globe,
  ArrowLeft
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AdminDashboard() {
  // Rol actual simulado: Cambiable para testear vista Admin vs Masajista
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>("ADMIN");
  const [loggedProId, setLoggedProId] = useState<string>("p1"); // Si es masajista

  // Filtros
  const [selectedProFilter, setSelectedProFilter] = useState<string>("ALL");
  const [tab, setTab] = useState<"AGENDA" | "AUDITORIA">("AGENDA");

  // Estados de Modales
  const [showManualModal, setShowManualModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [cancellingAppointment, setCancellingAppointment] = useState<Appointment | null>(null);

  // Turnos en memoria para demo interactiva
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "a1",
      cancellation_code: "TRN-9X4A",
      professional_id: "p1",
      service_id: "s1",
      start_datetime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
      end_datetime: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
      client_name: "Lucía Gómez",
      client_phone: "+54 9 11 3344-5566",
      client_email: "lucia@gmail.com",
      status: "CONFIRMED",
      source: "ONLINE",
      notes: "Molestia fuerte en zona cervical",
      created_at: new Date().toISOString(),
      service: MOCK_SERVICES[0],
      professional: MOCK_PROFESSIONALS[0]
    },
    {
      id: "a2",
      cancellation_code: "TRN-7B2C",
      professional_id: "p2",
      service_id: "s3",
      start_datetime: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
      end_datetime: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
      client_name: "Marcos Varela",
      client_phone: "+54 9 11 4455-6677",
      client_email: "marcos@gmail.com",
      status: "CONFIRMED",
      source: "MANUAL_WPP",
      notes: "Pidió turno directo por WhatsApp",
      created_at: new Date().toISOString(),
      service: MOCK_SERVICES[2],
      professional: MOCK_PROFESSIONALS[1]
    }
  ]);

  // Turnos filtrados según rol y selección
  const displayedAppointments = appointments.filter(app => {
    if (currentUserRole === "PROFESSIONAL") {
      return app.professional_id === loggedProId;
    }
    if (selectedProFilter === "ALL") return true;
    return app.professional_id === selectedProFilter;
  });

  const activeAppointments = displayedAppointments.filter(app => app.status === "CONFIRMED");
  const historyAppointments = displayedAppointments.filter(app => app.status !== "CONFIRMED");

  const handleCancelByPro = (reason: string) => {
    if (!cancellingAppointment) return;

    setAppointments(prev => prev.map(app => {
      if (app.id === cancellingAppointment.id) {
        return {
          ...app,
          status: "CANCELLED_BY_PRO",
          cancel_reason: reason,
          cancelled_at: new Date().toISOString()
        };
      }
      return app;
    }));
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "MANUAL_WPP":
        return <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded"><MessageCircle className="w-3 h-3" /> WhatsApp</span>;
      case "MANUAL_IG":
        return <span className="flex items-center gap-1 text-[11px] text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded"><Camera className="w-3 h-3" /> Instagram</span>;
      default:
        return <span className="flex items-center gap-1 text-[11px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded"><Globe className="w-3 h-3" /> Web</span>;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Barra Superior de Control de Rol y Perfil */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/" className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-xl font-bold text-white">Panel de Gestión</h1>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {currentUserRole === "ADMIN" ? "Administrador Central" : "Vista Profesional"}
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            {currentUserRole === "ADMIN" 
              ? "Supervisa todas las agendas, profesionales y auditoría de cancelaciones" 
              : `Gestionando agenda de: ${MOCK_PROFESSIONALS.find(p => p.id === loggedProId)?.name}`}
          </p>
        </div>

        {/* Switcher de Roles (para testing de requerimientos) */}
        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 p-1.5 rounded-2xl text-xs">
          <button
            onClick={() => setCurrentUserRole("ADMIN")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              currentUserRole === "ADMIN" 
                ? "bg-emerald-500 text-neutral-950 font-semibold" 
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Admin Central
          </button>
          <button
            onClick={() => setCurrentUserRole("PROFESSIONAL")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              currentUserRole === "PROFESSIONAL" 
                ? "bg-emerald-500 text-neutral-950 font-semibold" 
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Masajista (Camila)
          </button>
        </div>
      </header>

      {/* Barra de Acciones Rápidas */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 my-6">
        <div className="flex items-center gap-2">
          {currentUserRole === "ADMIN" && (
            <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-neutral-400" />
              <select
                value={selectedProFilter}
                onChange={(e) => setSelectedProFilter(e.target.value)}
                className="bg-transparent text-neutral-200 focus:outline-none"
              >
                <option value="ALL">Todos los profesionales</option>
                {MOCK_PROFESSIONALS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Solapas Agenda vs Auditoría */}
          <div className="flex bg-neutral-900 border border-neutral-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setTab("AGENDA")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                tab === "AGENDA" ? "bg-neutral-800 text-white font-medium" : "text-neutral-400 hover:text-white"
              }`}
            >
              Agenda ({activeAppointments.length})
            </button>
            <button
              onClick={() => setTab("AUDITORIA")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                tab === "AUDITORIA" ? "bg-neutral-800 text-white font-medium" : "text-neutral-400 hover:text-white"
              }`}
            >
              Auditoría & Cancelados ({historyAppointments.length})
            </button>
          </div>
        </div>

        {/* Botones de acción principal */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBlockModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-amber-400 text-xs font-medium transition-colors"
          >
            <Lock className="w-3.5 h-3.5" /> Bloquear Horario
          </button>
          <button
            onClick={() => setShowManualModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-semibold shadow-md shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Turno Manual
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      {tab === "AGENDA" ? (
        <div className="space-y-3">
          {activeAppointments.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-neutral-900/50 border border-neutral-800/80">
              <Calendar className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
              <p className="text-sm text-neutral-400">No hay turnos confirmados para este filtro.</p>
              <p className="text-xs text-neutral-600 mt-1">Carga un turno manual o espera reservas online.</p>
            </div>
          ) : (
            activeAppointments.map(app => (
              <div 
                key={app.id} 
                className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-white">
                      {format(new Date(app.start_datetime), "EEEE d 'de' MMMM, HH:mm", { locale: es })} hs
                    </span>
                    <span className="text-xs text-neutral-500">({app.service?.duration_minutes} min)</span>
                    {getSourceIcon(app.source)}
                    <span className="font-mono text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded">
                      {app.cancellation_code}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
                    <span>{app.service?.name}</span>
                    <span className="text-neutral-500">•</span>
                    <span className="text-neutral-300 text-xs font-normal">Prof: {app.professional?.name}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                    <span className="flex items-center gap-1.5 text-neutral-200">
                      <User className="w-3.5 h-3.5 text-neutral-500" /> {app.client_name}
                    </span>
                    <a 
                      href={`https://wa.me/${app.client_phone.replace(/[^0-9]/g, '')}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-emerald-400 hover:underline"
                    >
                      <Phone className="w-3.5 h-3.5" /> {app.client_phone}
                    </a>
                  </div>

                  {app.notes && (
                    <p className="text-xs text-amber-300/80 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg w-fit">
                      Nota: {app.notes}
                    </p>
                  )}
                </div>

                {/* Acciones por Turno */}
                <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-800">
                  <button
                    onClick={() => setCancellingAppointment(app)}
                    className="px-3 py-2 rounded-xl bg-neutral-950 hover:bg-red-950/40 border border-neutral-800 hover:border-red-500/40 text-neutral-400 hover:text-red-400 text-xs font-medium transition-colors"
                  >
                    Cancelar / Motivo
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* SOLAPA DE AUDITORÍA Y CANCELACIONES */
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 mb-4">
            <p className="font-semibold text-white mb-0.5">Control de Auditoría para el Administrador</p>
            <p>Aquí quedan registrados todos los turnos cancelados o reprogramados por profesionales o clientes, con su motivo correspondiente.</p>
          </div>

          {historyAppointments.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-neutral-900/50 border border-neutral-800/80">
              <CheckCircle className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
              <p className="text-sm text-neutral-400">Sin cancelaciones registradas en el historial.</p>
            </div>
          ) : (
            historyAppointments.map(app => (
              <div 
                key={app.id} 
                className="p-4 rounded-2xl bg-neutral-900/50 border border-red-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 font-semibold text-[10px]">
                      {app.status === "CANCELLED_BY_PRO" ? "CANCELADO POR PROFESIONAL" : "CANCELADO POR CLIENTE"}
                    </span>
                    <span className="text-neutral-400">
                      {format(new Date(app.start_datetime), "dd/MM/yyyy HH:mm")} hs
                    </span>
                  </div>

                  <p className="font-medium text-white">
                    {app.service?.name} con {app.professional?.name}
                  </p>
                  <p className="text-neutral-400">Cliente: {app.client_name} ({app.client_phone})</p>

                  {app.cancel_reason && (
                    <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/20 text-red-200 mt-2">
                      <span className="font-semibold block mb-0.5">Motivo registrado:</span>
                      {app.cancel_reason}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modales */}
      {showManualModal && (
        <ManualAppointmentModal
          professionals={MOCK_PROFESSIONALS}
          services={MOCK_SERVICES}
          defaultProfessionalId={currentUserRole === "PROFESSIONAL" ? loggedProId : undefined}
          onClose={() => setShowManualModal(false)}
          onSave={(newApp) => setAppointments(prev => [newApp, ...prev])}
        />
      )}

      {showBlockModal && (
        <BlockTimeModal
          professionals={MOCK_PROFESSIONALS}
          defaultProfessionalId={currentUserRole === "PROFESSIONAL" ? loggedProId : undefined}
          onClose={() => setShowBlockModal(false)}
          onSave={(override) => {
            alert(`Horario bloqueado con éxito para la fecha ${override.date}`);
          }}
        />
      )}

      {cancellingAppointment && (
        <CancelByProModal
          appointment={cancellingAppointment}
          onClose={() => setCancellingAppointment(null)}
          onConfirm={handleCancelByPro}
        />
      )}
    </div>
  );
}
