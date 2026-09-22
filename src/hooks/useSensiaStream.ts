import { useCallback, useEffect, useRef, useState } from "react";
import type {
  CognitiveMetrics,
  ConnectionState,
  GarminRawBiometrics,
} from "@/types/sensia";

const clamp = (v: number, min = 0, max = 100) => Math.min(max, Math.max(min, v));
const drift = (v: number, amount: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v + (Math.random() - 0.5) * amount));

const initialGarmin: GarminRawBiometrics = {
  heartRate: 68,
  hrv: 62,
  bodyBattery: 74,
  stressLevel: 31,
  sleepScore: 82,
  steps: 6430,
  spo2: 97,
  respiration: 14.2,
};

const initialCognitive: CognitiveMetrics = {
  cScore: 78,
  memory: 74,
  reasoning: 71,
  attention: 80,
  arousal: 0.18,
  valence: 0.34,
  cognitiveStress: 29,
};

function computeCognitive(
  g: GarminRawBiometrics,
  prev: CognitiveMetrics,
): CognitiveMetrics {
  // HRV alta + FC bassa => carico cognitivo basso, performance alta
  const hrvFactor = clamp((g.hrv - 20) * (100 / 80)); // 0-100
  const hrLoad = clamp((g.heartRate - 50) * (100 / 70)); // 0-100
  const recovery = clamp(g.bodyBattery * 0.6 + g.sleepScore * 0.4);

  const rawStress = clamp(
    hrLoad * 0.4 + g.stressLevel * 0.35 + (100 - hrvFactor) * 0.25,
  );
  const cognitiveStress = clamp(prev.cognitiveStress * 0.7 + rawStress * 0.3);

  const base = clamp(recovery * 0.6 + hrvFactor * 0.4 - cognitiveStress * 0.25 + 18);

  const smooth = (p: number, target: number) => clamp(p * 0.75 + target * 0.25);

  const attention = smooth(prev.attention, base + (Math.random() - 0.5) * 8);
  const memory = smooth(prev.memory, base * 0.95 + (Math.random() - 0.5) * 8);
  const reasoning = smooth(prev.reasoning, base * 0.92 + (Math.random() - 0.5) * 8);
  const cScore = clamp(attention * 0.35 + memory * 0.3 + reasoning * 0.35);

  const arousalTarget = (hrLoad / 100) * 1.6 - 0.8 + (100 - hrvFactor) / 400;
  const valenceTarget = (recovery - cognitiveStress) / 90;

  return {
    cScore,
    memory,
    reasoning,
    attention,
    cognitiveStress,
    arousal: Math.max(-1, Math.min(1, prev.arousal * 0.75 + arousalTarget * 0.25)),
    valence: Math.max(-1, Math.min(1, prev.valence * 0.8 + valenceTarget * 0.2)),
  };
}

export function useSensiaStream(enabled = true) {
  const [garmin, setGarmin] = useState<GarminRawBiometrics>(initialGarmin);
  const [cognitive, setCognitive] = useState<CognitiveMetrics>(initialCognitive);
  const [history, setHistory] = useState<number[]>(
    Array.from({ length: 40 }, (_, i) => 66 + Math.sin(i / 3) * 5),
  );
  const [respHistory, setRespHistory] = useState<number[]>(
    Array.from({ length: 40 }, (_, i) => 14 + Math.sin(i / 4) * 1.5),
  );
  const [connection, setConnection] = useState<ConnectionState>({
    isLive: true,
    lastSync: new Date().toISOString(),
    apiLatencyMs: 42,
  });

  const prevCognitive = useRef(initialCognitive);
  prevCognitive.current = cognitive;

  const toggleLive = useCallback(
    () => setConnection((c) => ({ ...c, isLive: !c.isLive })),
    [],
  );

  useEffect(() => {
    if (!enabled || !connection.isLive) return;
    const id = setInterval(() => {
      setGarmin((g) => {
        const next: GarminRawBiometrics = {
          heartRate: Math.round(drift(g.heartRate, 6, 52, 128)),
          hrv: Math.round(drift(g.hrv, 5, 18, 98)),
          bodyBattery: Math.round(drift(g.bodyBattery, 2, 5, 100)),
          stressLevel: Math.round(drift(g.stressLevel, 7, 2, 96)),
          sleepScore: g.sleepScore,
          steps: g.steps + Math.round(Math.random() * 14),
          spo2: Math.round(drift(g.spo2, 1.2, 93, 100)),
          respiration: Number(drift(g.respiration, 1.4, 9, 22).toFixed(1)),
        };
        setCognitive(computeCognitive(next, prevCognitive.current));
        setHistory((h) => [...h.slice(-59), next.heartRate]);
        setRespHistory((h) => [...h.slice(-59), next.respiration]);
        return next;
      });
      setConnection((c) => ({
        ...c,
        lastSync: new Date().toISOString(),
        apiLatencyMs: Math.round(drift(c.apiLatencyMs, 22, 18, 140)),
      }));
    }, 5000);
    return () => clearInterval(id);
  }, [enabled, connection.isLive]);

  return { garmin, cognitive, connection, history, respHistory, toggleLive };
}
