"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Appointment, 
  Professional, 
  Service, 
  ScheduleOverride, 
  UserRole 
} from "@/types";
import { GEA_PROFESSIONALS, GEA_SERVICES, GEA_INFO } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";
import { getSession, clearSession, SessionUser } from "@/lib/auth";
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
  ArrowLeft,
  LogOut
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AdminDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

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
      professional_id: "p_ailin",
      service_id: "s_descontracturante",
      start_datetime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
      end_datetime: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
      client_name: "Lucía Gómez",
      client_phone: "2235438952",
      client_email: "lucia@gmail.com",
      status: "CONFIRMED",
      source: "ONLINE",
      notes: "Molestia fuerte en zona cervical",
      created_at: new Date().toISOString(),
      service: GEA_SERVICES[0],
      professional: GEA_PROFESSIONALS[0]
    },
    {
      id: "a2",
      cancellation_code: "TRN-7B2C",
      professional_id: "p_patricia",
      service_id: "s_relajante",
      start_datetime: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
      end_datetime: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
      client_name: "Marcos Varela",
      client_phone: "2235438952",
      client_email: "marcos@gmail.com",
      status: "CONFIRMED",
      source: "MANUAL_WPP",
      notes: "Pidió turno directo por WhatsApp",
      created_at: new Date().toISOString(),
      service: GEA_SERVICES[2],
      professional: GEA_PROFESSIONALS[1]
    }
  ]);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/login");
    } else {
      setCurrentUser(session);
      if (session.role === "PROFESSIONAL" && session.professionalId) {
        setSelectedProFilter(session.professionalId);
      }
    }
    setIsLoaded(true);
  }, [router]);

  if (!isLoaded || !currentUser) {
    return (
      <div className="min-h-screen bg-[#19181d] flex items-center justify-center text-[#897a9b] text-sm">
        Verificando credenciales de acceso...
      </div>
    );
  }

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  // Turnos filtrados según rol y selección
  const displayedAppointments = appointments.filter(app => {
    if (currentUser.role === "PROFESSIONAL") {
      return app.professional_id === currentUser.professionalId;
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
    <div className="min-h-screen bg-[#19181d] text-[#f3f2f5] p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Barra Superior con Info de Usuario y Cerrar Sesión */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#585e73]/30">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/" className="p-1.5 rounded-lg bg-[#2a2732] hover:bg-[#34303e] text-[#897a9b] hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-xl font-bold text-white">Panel de Gestión</h1>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#dedfab]/20 text-[#dedfab] border border-[#dedfab]/30 font-semibold">
              {currentUser.role === "ADMIN" ? "Administración Central" : "Vista Profesional"}
            </span>
          </div>
          <p className="text-xs text-[#897a9b] mt-1">
            Conectado como: <strong className="text-white">{currentUser.name}</strong> ({currentUser.email})
          </p>
        </div>

        {/* Botón Salir / Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a2732] hover:bg-red-950/40 border border-[#585e73]/30 hover:border-red-500/40 text-xs text-[#897a9b] hover:text-red-300 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
        </button>
      </header>

      {/* Barra de Acciones Rápidas */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 my-6">
        <div className="flex items-center gap-2">
          {currentUser.role === "ADMIN" && (
            <div className="flex items-center gap-1.5 bg-[#2a2732] border border-[#585e73]/30 rounded-xl px-3 py-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-[#897a9b]" />
              <select
                value={selectedProFilter}
                onChange={(e) => setSelectedProFilter(e.target.value)}
                className="bg-transparent text-white focus:outline-none"
              >
                <option value="ALL" className="bg-[#2a2732]">Todos los profesionales</option>
                {GEA_PROFESSIONALS.map(p => (
                  <option key={p.id} value={p.id} className="bg-[#2a2732]">{p.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Solapas Agenda vs Auditoría */}
          <div className="flex bg-[#2a2732] border border-[#585e73]/30 rounded-xl p-1 text-xs">
            <button
              onClick={() => setTab("AGENDA")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                tab === "AGENDA" ? "bg-[#6f6181] text-white font-medium shadow-sm" : "text-[#897a9b] hover:text-white"
              }`}
            >
              Agenda ({activeAppointments.length})
            </button>
            <button
              onClick={() => setTab("AUDITORIA")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                tab === "AUDITORIA" ? "bg-[#6f6181] text-white font-medium shadow-sm" : "text-[#897a9b] hover:text-white"
              }`}
            >
              Auditoría ({historyAppointments.length})
            </button>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBlockModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#2a2732] hover:bg-[#34303e] border border-[#585e73]/40 text-amber-400 text-xs font-medium transition-colors"
          >
            <Lock className="w-3.5 h-3.5" /> Bloquear Horario
          </button>
          <button
            onClick={() => setShowManualModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#dedfab] hover:bg-[#dedfab]/90 text-[#1f1d24] text-xs font-bold shadow-md shadow-[#dedfab]/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Turno Manual
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      {tab === "AGENDA" ? (
        <div className="space-y-3">
          {activeAppointments.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#2a2732]/40 border border-[#585e73]/30">
              <Calendar className="w-8 h-8 text-[#897a9b] mx-auto mb-2" />
              <p className="text-sm text-white">No hay turnos confirmados en esta vista.</p>
              <p className="text-xs text-[#897a9b] mt-1">Carga un turno manual o aguarda reservas desde la web.</p>
            </div>
          ) : (
            activeAppointments.map(app => (
              <div 
                key={app.id} 
                className="p-4 rounded-2xl bg-[#2a2732]/70 border border-[#585e73]/30 hover:border-[#dedfab]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-white">
                      {format(new Date(app.start_datetime), "EEEE d 'de' MMMM, HH:mm", { locale: es })} hs
                    </span>
                    <span className="text-xs text-[#897a9b]">({app.service?.duration_minutes} min)</span>
                    {getSourceIcon(app.source)}
                    <span className="font-mono text-[10px] bg-[#1f1d24] text-[#dedfab] border border-[#585e73]/30 px-2 py-0.5 rounded">
                      {app.cancellation_code}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium text-[#dedfab]">
                    <span>{app.service?.name}</span>
                    <span className="text-[#897a9b]">•</span>
                    <span className="text-[#897a9b] text-xs font-normal">Terapeuta: {app.professional?.name}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#897a9b]">
                    <span className="flex items-center gap-1.5 text-white">
                      <User className="w-3.5 h-3.5 text-[#dedfab]" /> {app.client_name}
                    </span>
                    <a 
                      href={`https://wa.me/${app.client_phone.replace(/[^0-9]/g, '')}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-[#dedfab] hover:underline"
                    >
                      <Phone className="w-3.5 h-3.5" /> {app.client_phone}
                    </a>
                  </div>

                  {app.notes && (
                    <p className="text-xs text-amber-200 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg w-fit">
                      Nota: {app.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#585e73]/30">
                  <button
                    onClick={() => setCancellingAppointment(app)}
                    className="px-3 py-2 rounded-xl bg-[#1f1d24] hover:bg-red-950/40 border border-[#585e73]/40 hover:border-red-500/40 text-[#897a9b] hover:text-red-400 text-xs font-medium transition-colors"
                  >
                    Cancelar / Motivo
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* SOLAPA DE AUDITORÍA */
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-[#2a2732] border border-[#585e73]/30 text-xs text-[#897a9b] mb-4">
            <p className="font-semibold text-white mb-0.5">Control de Auditoría para Administración</p>
            <p>Registro histórico de turnos cancelados con motivo y trazabilidad.</p>
          </div>

          {historyAppointments.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#2a2732]/40 border border-[#585e73]/30">
              <CheckCircle className="w-8 h-8 text-[#897a9b] mx-auto mb-2" />
              <p className="text-sm text-white">Sin cancelaciones registradas en el historial.</p>
            </div>
          ) : (
            historyAppointments.map(app => (
              <div 
                key={app.id} 
                className="p-4 rounded-2xl bg-[#2a2732]/50 border border-red-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 font-semibold text-[10px]">
                      {app.status === "CANCELLED_BY_PRO" ? "CANCELADO POR PROFESIONAL" : "CANCELADO POR CLIENTE"}
                    </span>
                    <span className="text-[#897a9b]">
                      {format(new Date(app.start_datetime), "dd/MM/yyyy HH:mm")} hs
                    </span>
                  </div>

                  <p className="font-medium text-white">
                    {app.service?.name} con {app.professional?.name}
                  </p>
                  <p className="text-[#897a9b]">Cliente: {app.client_name} ({app.client_phone})</p>

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
          professionals={GEA_PROFESSIONALS}
          services={GEA_SERVICES}
          defaultProfessionalId={currentUser.role === "PROFESSIONAL" ? currentUser.professionalId : undefined}
          onClose={() => setShowManualModal(false)}
          onSave={(newApp) => setAppointments(prev => [newApp, ...prev])}
        />
      )}

      {showBlockModal && (
        <BlockTimeModal
          professionals={GEA_PROFESSIONALS}
          defaultProfessionalId={currentUser.role === "PROFESSIONAL" ? currentUser.professionalId : undefined}
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
