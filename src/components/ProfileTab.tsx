import { useState } from "react";
import { Moon, RotateCcw, Sun, UserRound } from "lucide-react";
import { useTranslation, type Lang } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { ACCENT, Card, SectionTitle } from "@/components/ui-kit";
import type { UserProfile } from "@/types/sensia";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#6d5ffc] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100";

export function ProfileTab({
  profile,
  onSave,
  onReset,
}: {
  profile: UserProfile;
  onSave: (p: UserProfile) => void;
  onReset: () => void;
}) {
  const { t, lang, setLang } = useTranslation();
  const { theme, setTheme, isDark } = useTheme();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);

  const genderLabel =
    profile.gender === "M" ? t("male") : profile.gender === "F" ? t("female") : t("other");

  const pill = (active: boolean) =>
    cn(
      "flex-1 rounded-xl py-2 text-xs font-semibold transition-colors",
      active
        ? "text-white"
        : "text-slate-600 dark:text-slate-400",
    );

  return (
    <div className="flex flex-col gap-5 px-5 pb-6 pt-3">
      <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">
        {t("tabProfile")}
      </h1>

      <Card>
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#6d5ffc]/10">
              <UserRound className="h-5 w-5" style={{ color: ACCENT }} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {profile.fullName}
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                {t("profileSummary")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (editing) onSave(draft);
              else setDraft(profile);
              setEditing(!editing);
            }}
            className="shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold text-white"
            style={{ background: ACCENT }}
          >
            {editing ? t("save") : t("edit")}
          </button>
        </div>

        {editing ? (
          <div className="mt-4 grid gap-3">
            <input
              className={inputClass}
              value={draft.fullName}
              onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                className={inputClass}
                type="number"
                value={draft.age}
                onChange={(e) => setDraft({ ...draft, age: Number(e.target.value) })}
              />
              <input
                className={inputClass}
                type="number"
                value={draft.weightKg}
                onChange={(e) =>
                  setDraft({ ...draft, weightKg: Number(e.target.value) })
                }
              />
              <input
                className={inputClass}
                type="number"
                value={draft.heightCm}
                onChange={(e) =>
                  setDraft({ ...draft, heightCm: Number(e.target.value) })
                }
              />
            </div>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            {[
              [t("age"), `${profile.age}`],
              [t("gender"), genderLabel],
              [t("weight"), `${profile.weightKg} kg`],
              [t("height"), `${profile.heightCm} cm`],
            ].map(([k, v]) => (
              <div
                key={k}
                className="rounded-xl bg-slate-100 px-3 py-2 dark:bg-slate-800/60"
              >
                <p className="text-slate-600 dark:text-slate-400">{k}</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{v}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div>
        <SectionTitle>{t("language")}</SectionTitle>
        <div className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900/90">
          {(["it", "en"] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={pill(lang === l)}
              style={lang === l ? { background: ACCENT } : undefined}
            >
              {l === "it" ? "Italiano" : "English"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>{t("appearance")}</SectionTitle>
        <div className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900/90">
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={cn(pill(isDark), "flex items-center justify-center gap-1.5")}
            style={isDark ? { background: ACCENT } : undefined}
          >
            <Moon className="h-3.5 w-3.5" /> {t("darkTheme")}
          </button>
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={cn(
              pill(theme === "light"),
              "flex items-center justify-center gap-1.5",
            )}
            style={theme === "light" ? { background: ACCENT } : undefined}
          >
            <Sun className="h-3.5 w-3.5" /> {t("lightTheme")}
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="flex items-center justify-center gap-2 rounded-2xl border border-rose-500/40 py-3 text-sm font-semibold text-rose-500 transition-colors hover:bg-rose-500/10"
      >
        <RotateCcw className="h-4 w-4" /> {t("resetApp")}
      </button>
    </div>
  );
}
