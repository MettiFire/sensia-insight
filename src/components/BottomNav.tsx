import { Activity, BrainCircuit, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/context/LanguageContext";
import { ACCENT } from "@/components/ui-kit";

export type TabId = "mind" | "vitals" | "profile";

export function BottomNav({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (t: TabId) => void;
}) {
  const { t } = useTranslation();
  const items: { id: TabId; label: string; Icon: typeof Activity }[] = [
    { id: "mind", label: t("tabMind"), Icon: BrainCircuit },
    { id: "vitals", label: t("tabVitals"), Icon: Activity },
    { id: "profile", label: t("tabProfile"), Icon: User },
  ];

  return (
    <nav className="shrink-0 border-t border-slate-200 bg-white/95 px-2 pb-3 pt-2 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <div className="grid grid-cols-3">
        {items.map(({ id, label, Icon }) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-[#6d5ffc]"
                  : "text-slate-500 dark:text-slate-400",
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 1.8} />
              <span className="truncate">{label}</span>
              <span
                className="h-0.5 w-6 rounded-full transition-colors"
                style={{ background: isActive ? ACCENT : "transparent" }}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
