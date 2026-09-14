"use client";

import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  fullWidth = true,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "h-12 px-4 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2",
        fullWidth && "w-full",
        variant === "primary" &&
          "bg-secondary text-white hover:bg-secondary/90 active:bg-secondary disabled:bg-secondary/40 disabled:cursor-not-allowed",
        variant === "secondary" &&
          "bg-surface text-secondary hover:bg-surface/80 disabled:opacity-40 disabled:cursor-not-allowed",
        variant === "ghost" &&
          "bg-transparent text-text-secondary hover:text-text-primary",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Input                                                               */
/* ------------------------------------------------------------------ */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
}

export function Input({ label, icon, className, id, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm text-text-secondary mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-secondary">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={cn(
            "w-full h-12 rounded-xl border border-secondary/15 bg-white text-sm text-text-primary placeholder-text-secondary/70 px-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-colors disabled:opacity-50",
            icon && "pl-11",
            className
          )}
          {...props}
        />
      </div>
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  icon?: ReactNode;
}

export function Textarea({ label, icon, className, id, ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm text-text-secondary mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-1.5 top-2.5 w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-secondary">
            {icon}
          </span>
        )}
        <textarea
          id={id}
          className={cn(
            "w-full min-h-[48px] rounded-xl border border-secondary/15 bg-white text-sm text-text-primary placeholder-text-secondary/70 px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-colors resize-none",
            icon && "pl-11",
            className
          )}
          {...props}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pill (used for badges / InfoLabel values)                          */
/* ------------------------------------------------------------------ */
export function Pill({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium",
        tone === "dark" ? "bg-secondary text-tertiary" : "bg-surface text-secondary",
        className
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* InfoLabel — read-only label / value pair                           */
/* ------------------------------------------------------------------ */
export function InfoLabel({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <span className="text-sm text-text-primary shrink-0">{label}:</span>
      <Pill className="break-words text-right">{value}</Pill>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* StatePoints — progress indicator                                    */
/* ------------------------------------------------------------------ */
export function StatePoints({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center justify-center gap-2.5">
      {Array.from({ length: total }, (_, i) => i + 1).map((i) => {
        const state = i < current ? "completed" : i === current ? "selected" : "default";
        return (
          <span
            key={i}
            className={cn(
              "rounded-full transition-all duration-300",
              state === "default" && "w-2.5 h-2.5 border-2 border-secondary/25 bg-transparent",
              state === "selected" && "w-3 h-3 bg-tertiary shadow-[0_0_0_3px_rgba(216,223,164,0.35)]",
              state === "completed" && "w-2.5 h-2.5 bg-secondary"
            )}
          />
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ServiceCard                                                         */
/* ------------------------------------------------------------------ */
export function ServiceCard({
  name,
  description,
  duration,
  price,
  selected,
  onClick,
}: {
  name: string;
  description?: string;
  duration: number;
  price: string;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group w-full text-left p-4 rounded-lg shadow-card transition-colors flex flex-col gap-1.5",
        selected ? "bg-secondary text-white" : "bg-surface text-text-primary hover:bg-secondary hover:text-white"
      )}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <h3 className="text-sm font-semibold">{name}</h3>
        <span
          className={cn(
            "text-[11px] font-medium px-2 py-0.5 rounded-lg transition-colors",
            selected
              ? "text-tertiary"
              : "bg-secondary text-tertiary group-hover:bg-transparent"
          )}
        >
          {duration}min
        </span>
        <span
          className={cn(
            "ml-auto text-sm font-bold transition-colors",
            selected ? "text-tertiary" : "text-secondary group-hover:text-tertiary"
          )}
        >
          {price}
        </span>
      </div>
      {description && (
        <p
          className={cn(
            "text-xs leading-relaxed transition-colors",
            selected ? "text-white/70" : "text-text-secondary group-hover:text-white/70"
          )}
        >
          {description}
        </p>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* ProfessionalCard                                                    */
/* ------------------------------------------------------------------ */
export function ProfessionalCard({
  name,
  specialty,
  selected,
  onClick,
  avatar,
}: {
  name: string;
  specialty?: string;
  selected?: boolean;
  onClick: () => void;
  avatar: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group w-full text-left rounded-lg overflow-hidden shadow-card transition-colors flex flex-col",
        selected ? "bg-secondary text-white" : "bg-surface text-text-primary hover:bg-secondary hover:text-white"
      )}
    >
      <div className="w-full aspect-square overflow-hidden">{avatar}</div>
      <div className="p-3">
        <h3 className="text-sm font-semibold">{name}</h3>
        {specialty && (
          <p
            className={cn(
              "text-xs mt-0.5 line-clamp-2 transition-colors",
              selected ? "text-white/70" : "text-text-secondary group-hover:text-white/70"
            )}
          >
            {specialty}
          </p>
        )}
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* CalendarDay                                                         */
/* ------------------------------------------------------------------ */
export function CalendarDay({
  weekday,
  day,
  selected,
  disabled,
  onClick,
}: {
  weekday: string;
  day: string;
  selected?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex-shrink-0 flex flex-col items-center justify-center w-16 py-3 rounded-xl border transition-colors",
        disabled && "border-transparent bg-transparent text-text-secondary/40 cursor-not-allowed",
        !disabled && selected && "bg-secondary border-secondary text-white shadow-card",
        !disabled && !selected && "bg-white border-secondary/10 text-text-primary hover:border-primary shadow-card"
      )}
    >
      <span className={cn("text-[11px] uppercase tracking-wide", selected && !disabled && "text-white/70")}>
        {weekday}
      </span>
      <span className={cn("text-lg font-bold mt-0.5", selected && !disabled && "text-tertiary")}>{day}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* TimeSlot                                                            */
/* ------------------------------------------------------------------ */
export function TimeSlotButton({
  time,
  selected,
  disabled,
  onClick,
}: {
  time: string;
  selected?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "py-2.5 rounded-xl text-xs font-medium border transition-colors",
        disabled && "bg-transparent border-secondary/10 text-text-secondary/40 cursor-not-allowed",
        !disabled && selected && "bg-secondary border-secondary text-tertiary font-bold shadow-card",
        !disabled && !selected && "bg-white border-secondary/15 text-text-primary hover:border-primary"
      )}
    >
      {time}
    </button>
  );
}
