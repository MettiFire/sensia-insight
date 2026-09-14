import { Activity, BatteryCharging, Droplets, Footprints, Gauge, Heart, Info, Moon, Wind } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { ACCENT, Bar, Card, SectionTitle } from "@/components/ui-kit";
import type { GarminRawBiometrics } from "@/types/sensia";

function Sparkline({ data }: { data: number[] }) {
  const w = 320;
  const h = 110;
  const padL = 34;
  const padR = 8;
  const padT = 8;
  const padB = 18;
  const iw = w - padL - padR;
  const ih = h - padT - padB;
  const rawMin = Math.min(...data);
  const rawMax = Math.max(...data);
  const min = Math.floor((rawMin - 4) / 5) * 5;
  const max = Math.ceil((rawMax + 4) / 5) * 5;
  const pts = data.map((v, i) => {
    const x = padL + (i / Math.max(1, data.length - 1)) * iw;
    const y = padT + ih - ((v - min) / Math.max(1, max - min)) * ih;
    return [x, y] as const;
  });
  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${padL},${padT + ih} ${line} ${padL + iw},${padT + ih}`;
  const yTicks = [min, Math.round((min + max) / 2), max];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-32 w-full">
      <defs>
        <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0.45" />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
        </linearGradient>
      </defs>
      {yTicks.map((v) => {
        const y = padT + ih - ((v - min) / Math.max(1, max - min)) * ih;
        return (
          <g key={v}>
            <line
              x1={padL}
              x2={padL + iw}
              y1={y}
              y2={y}
              stroke="currentColor"
              strokeOpacity="0.15"
              strokeDasharray="3 4"
            />
            <text
              x={padL - 5}
              y={y + 3}
              textAnchor="end"
              fontSize="9"
              fill="currentColor"
              opacity="0.55"
            >
              {v}
            </text>
          </g>
        );
      })}
      <text x={padL} y={h - 4} fontSize="9" fill="currentColor" opacity="0.55">
        -200s
      </text>
      <text
        x={padL + iw}
        y={h - 4}
        textAnchor="end"
        fontSize="9"
        fill="currentColor"
        opacity="0.55"
      >
        0s
      </text>
      <polygon points={area} fill="url(#hrGrad)" />
      <polyline
        points={line}
        fill="none"
        stroke={ACCENT}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {pts.map(([x, y], i) =>
        i === pts.length - 1 ? (
          <circle key={i} cx={x} cy={y} r="3.5" fill={ACCENT} strokeWidth="1.5" stroke="#fff" />
        ) : (
          <circle key={i} cx={x} cy={y} r="1.6" fill={ACCENT} opacity="0.65" />
        ),
      )}
    </svg>
  );
}

function StatCard({
  label,
  value,
  unit,
  Icon,
}: {
  label: string;
  value: string | number;
  unit?: string;
  Icon: typeof Heart;
}) {
  return (
    <Card className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" style={{ color: ACCENT }} />
        <span className="truncate text-[11px] font-medium text-slate-600 dark:text-slate-400">
          {label}
        </span>
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        {value}
        {unit ? (
          <span className="ml-1 text-xs font-medium text-slate-400">{unit}</span>
        ) : null}
      </div>
    </Card>
  );
}

export function VitalsTab({
  garmin,
  history,
}: {
  garmin: GarminRawBiometrics;
  history: number[];
}) {
  const { t } = useTranslation();
  const sleepHours = (garmin.sleepScore / 100) * 8.4;

  return (
    <div className="flex flex-col gap-5 px-5 pb-6 pt-3">
      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
        Garmin Vitals
      </h1>

      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-rose-500" />
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t("heartRate")}
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {garmin.heartRate}
            <span className="ml-1 text-xs font-medium text-slate-400">
              {t("bpm")}
            </span>
          </div>
        </div>
        <Sparkline data={history} />
        <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>
            {t("hrv")} · {garmin.hrv} {t("ms")}
          </span>
          <span>60s</span>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <div className="flex items-center gap-2">
            <BatteryCharging className="h-4 w-4" style={{ color: ACCENT }} />
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
              {t("bodyBattery")}
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {garmin.bodyBattery}
          </div>
          <Bar value={garmin.bodyBattery} className="mt-2" />
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-amber-500" />
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
              {t("garminStress")}
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {garmin.stressLevel}
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-700"
              style={{ width: `${garmin.stressLevel}%` }}
            />
          </div>
        </Card>
      </div>

      <div>
        <SectionTitle>{t("sleep")}</SectionTitle>
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4" style={{ color: ACCENT }} />
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t("sleepScore")}
              </span>
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {garmin.sleepScore}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
            {t("totalHours")}: {sleepHours.toFixed(1)}h
          </p>
          <div className="mt-3 flex h-2.5 overflow-hidden rounded-full">
            <div className="bg-[#6d5ffc]" style={{ width: "24%" }} />
            <div className="bg-[#6d5ffc]/60" style={{ width: "48%" }} />
            <div className="bg-emerald-500/70" style={{ width: "21%" }} />
            <div className="bg-slate-400/60" style={{ width: "7%" }} />
          </div>
          <div className="mt-2 grid grid-cols-4 text-center text-[10px] text-slate-500 dark:text-slate-400">
            <span>{t("deep")} 24%</span>
            <span>{t("lightSleep")} 48%</span>
            <span>{t("rem")} 21%</span>
            <span>{t("awake")} 7%</span>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Footprints className="h-4 w-4" style={{ color: ACCENT }} />
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t("steps")}
            </span>
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {garmin.steps.toLocaleString()}{" "}
            <span className="text-[11px] font-normal text-slate-400">
              / 10.000
            </span>
          </span>
        </div>
        <Bar value={(garmin.steps / 10000) * 100} className="mt-3" />
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label={t("spo2")} value={garmin.spo2} unit="%" Icon={Droplets} />
        <StatCard
          label={t("respiration")}
          value={garmin.respiration}
          unit="rpm"
          Icon={Wind}
        />
      </div>

      <div className="flex gap-3 rounded-2xl border border-[#6d5ffc]/30 bg-[#6d5ffc]/5 p-4">
        <Info className="h-4 w-4 shrink-0" style={{ color: ACCENT }} />
        <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
          {t("processingInfo")}
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
        <Activity className="h-3.5 w-3.5" /> Sensia.bio streaming engine v2.0
      </div>
    </div>
  );
}
