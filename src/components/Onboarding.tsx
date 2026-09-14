import { useState } from "react";
import { ArrowRight, BadgeCheck, Loader2, Watch, Waves } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { ACCENT, Card, LangToggle, ThemeToggle } from "@/components/ui-kit";
import type { Gender, UserProfile } from "@/types/sensia";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#6d5ffc] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100";

export function Onboarding({ onDone }: { onDone: (p: UserProfile) => void }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "",
    age: "",
    gender: "M" as Gender,
    weightKg: "",
    heightCm: "",
  });
  const [garmin, setGarmin] = useState<"idle" | "loading" | "done">("idle");
  const [touchedAll, setTouchedAll] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const showError = (key: string) => touchedAll || touchedFields[key];

  const errors = {
    fullName: form.fullName.trim().length < 2,
    age: !(Number(form.age) >= 5 && Number(form.age) <= 110),
    weightKg: !(Number(form.weightKg) >= 25 && Number(form.weightKg) <= 300),
    heightCm: !(Number(form.heightCm) >= 90 && Number(form.heightCm) <= 250),
  };
  const valid = !Object.values(errors).some(Boolean) && garmin === "done";

  const connect = () => {
    setGarmin("loading");
    setTimeout(() => setGarmin("done"), 2200);
  };

  const field = (
    key: "fullName" | "age" | "weightKg" | "heightCm",
    label: string,
    hintKey: "hintName" | "hintAge" | "hintWeight" | "hintHeight",
    type = "text",
  ) => {
    const hasError = showError(key) && errors[key];
    const isOk = form[key] !== "" && !errors[key];
    return (
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
          {label}
        </label>
        <input
          type={type}
          inputMode={type === "number" ? "numeric" : "text"}
          value={form[key]}
          onChange={(e) => {
            setForm({ ...form, [key]: e.target.value });
            setTouchedFields((prev) => ({ ...prev, [key]: true }));
          }}
          onBlur={() => setTouchedFields((prev) => ({ ...prev, [key]: true }))}
          className={cn(
            inputClass,
            hasError && "border-red-500 focus:border-red-500",
            isOk && "border-emerald-500 focus:border-emerald-500",
          )}
        />
        {hasError ? (
          <p className="mt-1 text-[11px] font-medium text-red-500">
            {form[key] ? `${t("invalid")} · ${t(hintKey)}` : t("required")}
          </p>
        ) : (
          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
            {t(hintKey)}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-8">
      <header className="flex items-center justify-between py-3">
        <span className="text-sm font-bold tracking-[0.3em] text-slate-900 dark:text-slate-100">
          SENSIA
        </span>
        <div className="flex items-center gap-2">
          <LangToggle compact />
          <ThemeToggle compact />
        </div>
      </header>

      {step === 1 ? (
        <div className="flex flex-1 flex-col justify-center gap-6 text-center">
          <div
            className="mx-auto grid h-20 w-20 place-items-center rounded-3xl"
            style={{ background: `linear-gradient(140deg, ${ACCENT}, ${ACCENT}55)` }}
          >
            <Waves className="h-9 w-9 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-[0.18em] text-slate-900 dark:text-slate-100">
              SEN<span style={{ color: ACCENT }}>SIA</span>
            </h1>
            <p className="mt-3 text-lg font-semibold leading-snug text-slate-900 dark:text-slate-100">
              {t("tagline")}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t("welcomeDesc")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-white shadow-lg transition-transform active:scale-[0.98]"
            style={{ background: ACCENT }}
          >
            {t("startSetup")} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 pb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {t("personalData")}
          </h2>
          <div className="grid gap-3">
            {field("fullName", t("fullName"), "hintName")}
            <div className="grid grid-cols-2 gap-3">
              {field("age", t("age"), "hintAge", "number")}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  {t("gender")}
                </label>
                <select
                  value={form.gender}
                  onChange={(e) =>
                    setForm({ ...form, gender: e.target.value as Gender })
                  }
                  className={inputClass}
                >
                  <option value="M">{t("male")}</option>
                  <option value="F">{t("female")}</option>
                  <option value="Other">{t("other")}</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {field("weightKg", t("weight"), "hintWeight", "number")}
              {field("heightCm", t("height"), "hintHeight", "number")}
            </div>
          </div>

          <Card className="mt-1">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 dark:bg-slate-800">
                <Watch className="h-5 w-5" style={{ color: ACCENT }} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {t("pairing")}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {t("pairingDesc")}
                </p>
              </div>
            </div>
            <div className="mt-3">
              {garmin === "done" ? (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  <BadgeCheck className="h-4 w-4" /> {t("garminConnected")}
                </div>
              ) : (
                <button
                  type="button"
                  disabled={garmin === "loading"}
                  onClick={connect}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:border-[#6d5ffc] disabled:opacity-70 dark:border-slate-800 dark:text-slate-100"
                >
                  {garmin === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> {t("connecting")}
                    </>
                  ) : (
                    t("connectGarmin")
                  )}
                </button>
              )}
            </div>
          </Card>

          <button
            type="button"
            onClick={() => {
              setTouchedAll(true);
              if (!valid) return;
              onDone({
                fullName: form.fullName.trim(),
                age: Number(form.age),
                gender: form.gender,
                weightKg: Number(form.weightKg),
                heightCm: Number(form.heightCm),
                isGarminConnected: true,
              });
            }}
            className="mt-1 w-full rounded-2xl py-3.5 text-sm font-semibold text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-40"
            style={{ background: ACCENT }}
            disabled={!valid}
          >
            {t("enterDashboard")}
          </button>
        </div>
      )}
    </div>
  );
}
