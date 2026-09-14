export type Gender = "M" | "F" | "Other";

export interface UserProfile {
  fullName: string;
  age: number;
  gender: Gender;
  weightKg: number;
  heightCm: number;
  isGarminConnected: boolean;
}

export interface CognitiveMetrics {
  cScore: number;
  memory: number;
  reasoning: number;
  attention: number;
  /** -1.0 .. +1.0 */
  arousal: number;
  /** -1.0 .. +1.0 */
  valence: number;
  cognitiveStress: number;
}

export type StressBadge = "low" | "moderate" | "high";

export interface GarminRawBiometrics {
  heartRate: number;
  hrv: number;
  bodyBattery: number;
  stressLevel: number;
  sleepScore: number;
  steps: number;
  spo2: number;
  respiration: number;
}

export interface ConnectionState {
  isLive: boolean;
  lastSync: string;
  apiLatencyMs: number;
}

export const stressBadge = (v: number): StressBadge =>
  v < 34 ? "low" : v < 67 ? "moderate" : "high";
