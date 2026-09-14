import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(price);
}

/**
 * Chrome (and other browsers) recompute :hover against the pointer's last known
 * position whenever the layout shifts under it — even without a new mousemove.
 * After a list reflows (e.g. switching category/step), that can leave a card
 * "stuck" in its hover state until the pointer actually moves. Briefly disabling
 * pointer-events forces the browser to drop any stale hover and only re-apply it
 * once a genuine mousemove occurs over an element.
 */
export function resetHoverState() {
  if (typeof document === "undefined") return;
  document.body.style.pointerEvents = "none";
  requestAnimationFrame(() => {
    document.body.style.pointerEvents = "";
  });
}

export function generateCancellationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'TRN-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
