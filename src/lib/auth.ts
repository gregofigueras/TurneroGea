import { UserRole } from "@/types";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  professionalId?: string;
}

export const DEMO_CREDENTIALS = [
  {
    email: "admin@gea.com",
    password: "admin",
    name: "Administración Central",
    role: "ADMIN" as UserRole
  },
  {
    email: "ailin@gea.com",
    password: "ailin",
    name: "Ailin",
    role: "PROFESSIONAL" as UserRole,
    professionalId: "p_ailin"
  },
  {
    email: "patricia@gea.com",
    password: "patri",
    name: "Patricia",
    role: "PROFESSIONAL" as UserRole,
    professionalId: "p_patricia"
  },
  {
    email: "mauro@gea.com",
    password: "mauro",
    name: "Mauro",
    role: "PROFESSIONAL" as UserRole,
    professionalId: "p_mauro"
  },
  {
    email: "celeste@gea.com",
    password: "celes",
    name: "Celeste",
    role: "PROFESSIONAL" as UserRole,
    professionalId: "p_celeste"
  }
];

export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("gea_staff_session");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as SessionUser;
  } catch {
    return null;
  }
}

export function setSession(user: SessionUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem("gea_staff_session", JSON.stringify(user));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("gea_staff_session");
}
