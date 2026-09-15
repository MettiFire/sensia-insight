import { Cpu, Gauge, HeartPulse, Radio, Target, TrendingDown, TrendingUp } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { ACCENT, Bar, Card, LangToggle, RadialGauge, SectionTitle, ThemeToggle } from "@/components/ui-kit";
import { stressBadge, type CognitiveMetrics, type ConnectionState, type StressBadge } from "@/types/sensia";
import { cn } from "@/lib/utils";

const BADGE_COLORS: Record<StressBadge, string> = {
  low: "#10b981",
  moderate: "#f59e0b",
  high: "#f43f5e",
};

function MetricCard({
  label,
  value,
  Icon,
  trend,
  color,
}: {
  label: string;
  value: number;
  Icon: typeof Cpu;
  trend: number;
  color: string;
}) {
  const up = trend >= 0;
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div
          className="grid h-8 w-8 place-items-center rounded-lg"
          style={{ background: `${color}1a` }}
        >
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
        <span
          className={cn(
            "flex items-center gap-0.5 text-[11px] font-semibold",
            up ? "text-emerald-500" : "text-rose-500",
          )}
        >
          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(trend).toFixed(1)}
        </span>
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        {Math.round(value)}
      </div>
      <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
        {label}
      </div>
      <Bar value={value} color={color} />
    </Card>
  );
}

function StressCard({
  value,
  badgeLabel,
}: {
  value: number;
  badgeLabel: string;
}) {
  const badge = stressBadge(value);
  const color = BADGE_COLORS[badge];
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div
          className="grid h-8 w-8 place-items-center rounded-lg"
          style={{ background: `${color}1a` }}
        >
          <Gauge className="h-4 w-4" style={{ color }} />
        </div>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={{ color, background: `${color}1a` }}
        >
          {badgeLabel}
        </span>
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        {Math.round(value)}
      </div>
      <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
        {t_stressLabel}
      </div>
      <Bar value={value} color={color} />
    </Card>
  );
}

export function MindTab({
  name,
  cognitive,
  connection,
  onToggleLive,
}: {
  name: string;
  cognitive: CognitiveMetrics;
  connection: ConnectionState;
  onToggleLive: () => void;
}) {
  const { t } = useTranslation();
  const badge = stressBadge(cognitive.cognitiveStress);
  const badgeLabel = t(badge);
  const badgeColor = BADGE_COLORS[badge];

  const valencePct = ((cognitive.valence + 1) / 2) * 100;
  const arousalPct = ((cognitive.arousal + 1) / 2) * 100;
  const valenceDotColor =
    cognitive.valence >= 0.15
      ? "#10b981"
      : cognitive.valence <= -0.15
        ? "#f43f5e"
        : "#f59e0b";

  return (
    <div className="flex flex-col gap-5 px-5 pb-6 pt-2">
      <header className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-3">
          <h1 className="min-w-0 truncate text-3xl font-black text-slate-900 dark:text-slate-100">
            {t("hello")}, {name}
          </h1>
          <div className="flex shrink-0 items-center gap-2">
            <LangToggle compact />
            <ThemeToggle compact />
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleLive}
          className="flex items-center gap-2 self-start text-[11px] font-medium text-slate-600 dark:text-slate-400"
        >
          <span className="relative flex h-2 w-2">
            {connection.isLive ? (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            ) : null}
            <span
              className={cn(
                "relative inline-flex h-2 w-2 rounded-full",
                connection.isLive ? "bg-emerald-500" : "bg-rose-500",
              )}
            />
          </span>
          {connection.isLive ? t("live") : t("offline")}
          <span className="text-slate-400">· {connection.apiLatencyMs}ms</span>
        </button>
      </header>

      <Card className="flex items-center gap-5">
        <RadialGauge value={cognitive.cScore} label={t("cScore")} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {t("cognitiveStates")}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            Sensia.bio · {t("lastSync")}:{" "}
            {new Date(connection.lastSync).toLocaleTimeString()}
          </p>
        </div>
      </Card>

      <div>
        <SectionTitle>{t("cognitiveStates")}</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <StressCard value={cognitive.cognitiveStress} badgeLabel={badgeLabel} />
          <MetricCard
            label={t("reasoning")}
            value={cognitive.reasoning}
            Icon={Cpu}
            trend={cognitive.reasoning - 70}
            color="#0ea5e9"
          />
          <MetricCard
            label={t("attention")}
            value={cognitive.attention}
            Icon={Target}
            trend={cognitive.attention - 70}
            color="#f59e0b"
          />
          <MetricCard
            label={t("cScore")}
            value={cognitive.cScore}
            Icon={Radio}
            trend={cognitive.cScore - 70}
            color="#10b981"
          />
        </div>
      </div>

      <div>
        <SectionTitle>{t("emotionalStates")}</SectionTitle>
        <div className="flex flex-col gap-3">
          <Card>
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {t("arousal")}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  {t("arousalSub")}
                </p>
              </div>
              <span className="text-xl font-bold" style={{ color: ACCENT }}>
                {cognitive.arousal.toFixed(2)}
              </span>
            </div>
            <div className="relative mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full"
                style={{
                  width: "100%",
                  background: "linear-gradient(90deg,#94a3b8,#6d5ffc)",
                  opacity: 0.35,
                }}
              />
              <div className="absolute left-1/2 top-[-4px] h-4 w-px bg-slate-400/60" />
              <div
                className="absolute top-[-3px] h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-white transition-all duration-700 dark:border-slate-900"
                style={{ left: `${arousalPct}%`, background: ACCENT }}
              />
            </div>
          </Card>
          <Card>
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {t("valence")}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  {t("valenceSub")}
                </p>
              </div>
              <span className="text-xl font-bold" style={{ color: valenceDotColor }}>
                {cognitive.valence.toFixed(2)}
              </span>
            </div>
            <div className="relative mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full"
                style={{
                  width: "100%",
                  background: "linear-gradient(90deg,#f43f5e,#f59e0b,#10b981)",
                  opacity: 0.35,
                }}
              />
              <div className="absolute left-1/2 top-[-4px] h-4 w-px bg-slate-400/60" />
              <div
                className="absolute top-[-3px] h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-white transition-all duration-700 dark:border-slate-900"
                style={{ left: `${valencePct}%`, background: valenceDotColor }}
              />
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {t("heartRateTrend") ?? t("cognitiveStress")}
          </p>
        </div>
      </Card>
    </div>
  );
}
