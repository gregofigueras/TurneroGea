"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DEMO_CREDENTIALS, setSession } from "@/lib/auth";
import { Lock, Mail, ArrowLeft, ShieldCheck, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const found = DEMO_CREDENTIALS.find(
      (c) => c.email.toLowerCase() === email.trim().toLowerCase() && c.password === password
    );

    if (found) {
      setSession({
        id: found.email,
        name: found.name,
        email: found.email,
        role: found.role,
        professionalId: found.professionalId
      });
      router.push("/admin");
    } else {
      setError("Email o contraseña incorrectos.");
    }
  };

  const handleQuickLogin = (emailPreset: string, passPreset: string) => {
    setEmail(emailPreset);
    setPassword(passPreset);
  };

  return (
    <div className="min-h-screen bg-[#19181d] text-[#f3f2f5] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Link 
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#897a9b] hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al turnero
        </Link>

        <div className="bg-[#2a2732] border border-[#585e73]/40 rounded-3xl p-6 shadow-2xl space-y-5">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-2">
              <Image
                src="/gea-logo.png"
                alt="Gea Espacio de Bienestar"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-lg font-bold text-white">Acceso Staff</h1>
            <p className="text-xs text-[#897a9b] mt-0.5">Administración y Profesionales de Gea</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#897a9b] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="usuario@gea.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1f1d24] border border-[#585e73]/40 focus:border-[#dedfab] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-[#897a9b] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#897a9b] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1f1d24] border border-[#585e73]/40 focus:border-[#dedfab] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-[#897a9b] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#dedfab] hover:bg-[#dedfab]/90 text-[#1f1d24] font-bold tracking-wider uppercase text-xs transition-all shadow-md shadow-[#dedfab]/20 mt-2"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Accesos rápidos de demostración */}
          <div className="pt-3 border-t border-[#585e73]/30">
            <p className="text-[11px] text-[#897a9b] text-center mb-2 font-medium">
              Cuentas demo para probar:
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              <button
                type="button"
                onClick={() => handleQuickLogin("admin@gea.com", "admin")}
                className="p-1.5 rounded-lg bg-[#1f1d24] border border-[#585e73]/30 text-left hover:border-[#dedfab] text-neutral-300"
              >
                <span className="font-bold text-[#dedfab] block">Admin</span>
                admin@gea.com / admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("ailin@gea.com", "ailin")}
                className="p-1.5 rounded-lg bg-[#1f1d24] border border-[#585e73]/30 text-left hover:border-[#dedfab] text-neutral-300"
              >
                <span className="font-bold text-[#dedfab] block">Ailin (Pro)</span>
                ailin@gea.com / ailin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("mauro@gea.com", "mauro")}
                className="p-1.5 rounded-lg bg-[#1f1d24] border border-[#585e73]/30 text-left hover:border-[#dedfab] text-neutral-300"
              >
                <span className="font-bold text-[#dedfab] block">Mauro (Pro)</span>
                mauro@gea.com / mauro
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("patricia@gea.com", "patri")}
                className="p-1.5 rounded-lg bg-[#1f1d24] border border-[#585e73]/30 text-left hover:border-[#dedfab] text-neutral-300"
              >
                <span className="font-bold text-[#dedfab] block">Patricia (Pro)</span>
                patricia@gea.com / patri
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
