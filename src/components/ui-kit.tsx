import type { ReactNode } from "react";
import { Languages, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/context/LanguageContext";

export const ACCENT = "#6d5ffc";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900/90",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
      {children}
    </h2>
  );
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={cn(
        "grid place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:border-[#6d5ffc] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
        compact ? "h-8 w-8" : "h-9 w-9",
      )}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function LangToggle({ compact = false }: { compact?: boolean }) {
  const { lang, toggleLang } = useTranslation();
  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label="Toggle language"
      className={cn(
        "flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 text-slate-700 transition-colors hover:border-[#6d5ffc] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
        compact ? "h-8 text-[11px]" : "h-9 text-xs",
      )}
    >
      <Languages className="h-3.5 w-3.5" />
      <span className="font-semibold uppercase">{lang}</span>
    </button>
  );
}

export function RadialGauge({
  value,
  label,
  sublabel,
  size = 120,
}: {
  value: number;
  label: string;
  sublabel?: string;
  size?: number;
}) {
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className="stroke-slate-200 dark:stroke-slate-800"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          stroke={ACCENT}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
          style={{ transition: "stroke-dashoffset 900ms ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          {Math.round(value)}
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </div>
        {sublabel ? (
          <div className="text-[10px] text-slate-400">{sublabel}</div>
        ) : null}
      </div>
    </div>
  );
}

export function Bar({ value, className }: { value: number; className?: string }) {
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800",
        className,
      )}
    >
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          background: `linear-gradient(90deg, ${ACCENT}88, ${ACCENT})`,
        }}
      />
    </div>
  );
}
