import { Activity, Footprints, Heart, Info, Moon, Wind } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { ACCENT, Bar, Card } from "@/components/ui-kit";
import type { GarminRawBiometrics } from "@/types/sensia";

function Sparkline({
  data,
  gradientId,
}: {
  data: number[];
  gradientId: string;
}) {
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
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
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
      <polygon points={area} fill={`url(#${gradientId})`} />
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

export function VitalsTab({
  garmin,
  history,
  respHistory,
}: {
  garmin: GarminRawBiometrics;
  history: number[];
  respHistory: number[];
}) {
  const { t } = useTranslation();
  const sleepHours = (garmin.sleepScore / 100) * 8.4;

  return (
    <div className="flex flex-col gap-5 px-5 pb-6 pt-3">
      <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">
        Vitals
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
        <Sparkline data={history} gradientId="hrGrad" />
        <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>
            {t("hrv")} · {garmin.hrv} {t("ms")}
          </span>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4" style={{ color: ACCENT }} />
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t("respiration")}
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {garmin.respiration.toFixed(1)}
            <span className="ml-1 text-xs font-medium text-slate-400">rpm</span>
          </div>
        </div>
        <Sparkline data={respHistory} gradientId="respGrad" />
      </Card>

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
          <div className="bg-indigo-600" style={{ width: "24%" }} />
          <div className="bg-sky-400" style={{ width: "48%" }} />
          <div className="bg-amber-400" style={{ width: "21%" }} />
          <div className="bg-slate-400" style={{ width: "7%" }} />
        </div>
        <div className="mt-2 grid grid-cols-4 text-center text-[10px] text-slate-500 dark:text-slate-400">
          {[
            [t("deep"), "24%", "bg-indigo-600"],
            [t("lightSleep"), "48%", "bg-sky-400"],
            [t("rem"), "21%", "bg-amber-400"],
            [t("awake"), "7%", "bg-slate-400"],
          ].map(([label, pct, dot]) => (
            <span key={label} className="flex items-center justify-center gap-1">
              <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
              {label} {pct}
            </span>
          ))}
        </div>
      </Card>

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
