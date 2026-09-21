import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "it" | "en";

export const translations = {
  it: {
    appName: "SENSIA",
    tagline: "Biometria Cognitiva ed Emotiva in Tempo Reale",
    welcomeDesc:
      "Sensia acquisisce i biometrici del tuo dispositivo Garmin e li elabora con le API scientifiche di Sensia.bio per stimare in tempo reale stati cognitivi ed emotivi.",
    startSetup: "Inizia Configurazione",
    personalData: "Dati Personali",
    fullName: "Nome Completo",
    age: "Età",
    gender: "Sesso",
    male: "Maschio",
    female: "Femmina",
    other: "Altro",
    weight: "Peso (kg)",
    height: "Altezza (cm)",
    pairing: "Pairing Garmin Connect",
    pairingDesc: "Collega il tuo account per lo streaming dei biometrici.",
    connectGarmin: "Collega Account Garmin",
    connecting: "Autenticazione in corso...",
    garminConnected: "Garmin Collegato",
    enterDashboard: "Entra nella Dashboard",
    required: "Campo obbligatorio",
    invalid: "Valore non valido",
    hintName: "Minimo 2 caratteri",
    hintAge: "Tra 5 e 110 anni",
    hintWeight: "Tra 25 e 300 kg",
    hintHeight: "Tra 90 e 250 cm",
    hello: "Ciao",
    live: "Live Streaming",
    offline: "Offline",
    latency: "Latenza API",
    lastSync: "Ultima sincronizzazione",
    cognitiveStates: "Stati Cognitivi",
    emotionalStates: "Stati Emotivi",
    cScore: "C-Score",
    memory: "Memoria",
    reasoning: "Ragionamento",
    attention: "Attenzione",
    arousal: "Arousal",
    arousalSub: "Attivazione",
    valence: "Valenza",
    valenceSub: "Tono emotivo",
    cognitiveStress: "Stress Cognitivo",
    low: "Basso",
    moderate: "Moderato",
    high: "Alto",
    tabMind: "Sensia Mind",
    tabVitals: "Vitals",
    tabProfile: "Profilo",
    heartRate: "Frequenza Cardiaca",
    hrv: "HRV",
    bodyBattery: "Body Battery",
    garminStress: "Stress Garmin",
    sleep: "Sonno",
    sleepScore: "Punteggio Sonno",
    totalHours: "Ore totali",
    deep: "Profondo",
    lightSleep: "Leggero",
    rem: "REM",
    awake: "Sveglio",
    steps: "Passi",
    goal: "Obiettivo",
    spo2: "SpO2",
    respiration: "Respirazione",
    processingInfo:
      "I dati grezzi Garmin vengono inviati alle API Sensia.bio, che applicano modelli psicofisiologici per derivare metriche cognitive ed emotive.",
    profileSummary: "Riepilogo Profilo",
    edit: "Modifica",
    save: "Salva",
    language: "Lingua",
    appearance: "Aspetto",
    darkTheme: "Tema Scuro",
    lightTheme: "Tema Chiaro",
    inspector: "Sensia.bio API Inspector",
    copyJson: "Copia JSON",
    copied: "Copiato!",
    resetApp: "Reset Completo App",
    bpm: "bpm",
    ms: "ms",
    trendUp: "in salita",
  },
  en: {
    appName: "SENSIA",
    tagline: "Real-Time Cognitive and Emotional Biometrics",
    welcomeDesc:
      "Sensia captures your Garmin biometrics and processes them through the scientific Sensia.bio APIs to estimate cognitive and emotional states in real time.",
    startSetup: "Start Setup",
    personalData: "Personal Data",
    fullName: "Full Name",
    age: "Age",
    gender: "Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    weight: "Weight (kg)",
    height: "Height (cm)",
    pairing: "Garmin Connect Pairing",
    pairingDesc: "Link your account to stream biometrics.",
    connectGarmin: "Connect Garmin Account",
    connecting: "Authenticating...",
    garminConnected: "Garmin Connected",
    enterDashboard: "Enter Dashboard",
    required: "Required field",
    invalid: "Invalid value",
    hintName: "At least 2 characters",
    hintAge: "Between 5 and 110 years",
    hintWeight: "Between 25 and 300 kg",
    hintHeight: "Between 90 and 250 cm",
    hello: "Hello",
    live: "Live Streaming",
    offline: "Offline",
    latency: "API latency",
    lastSync: "Last sync",
    cognitiveStates: "Cognitive States",
    emotionalStates: "Emotional States",
    cScore: "C-Score",
    memory: "Memory",
    reasoning: "Reasoning",
    attention: "Attention",
    arousal: "Arousal",
    arousalSub: "Activation",
    valence: "Valence",
    valenceSub: "Emotional tone",
    cognitiveStress: "Cognitive Stress",
    low: "Low",
    moderate: "Moderate",
    high: "High",
    tabMind: "Sensia Mind",
    tabVitals: "Vitals",
    tabProfile: "Profile",
    heartRate: "Heart Rate",
    hrv: "HRV",
    bodyBattery: "Body Battery",
    garminStress: "Garmin Stress",
    sleep: "Sleep",
    sleepScore: "Sleep Score",
    totalHours: "Total hours",
    deep: "Deep",
    lightSleep: "Light",
    rem: "REM",
    awake: "Awake",
    steps: "Steps",
    goal: "Goal",
    spo2: "SpO2",
    respiration: "Respiration",
    processingInfo:
      "Raw Garmin data is streamed to the Sensia.bio APIs, which apply psychophysiological models to derive cognitive and emotional metrics.",
    profileSummary: "Profile Summary",
    edit: "Edit",
    save: "Save",
    language: "Language",
    appearance: "Appearance",
    darkTheme: "Dark Theme",
    lightTheme: "Light Theme",
    inspector: "Sensia.bio API Inspector",
    copyJson: "Copy JSON",
    copied: "Copied!",
    resetApp: "Full App Reset",
    bpm: "bpm",
    ms: "ms",
    trendUp: "rising",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["it"];

interface LanguageValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageValue | null>(null);
const STORAGE_KEY = "sensia.lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("it");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "it" || saved === "en") setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const toggleLang = useCallback(
    () => setLang(lang === "it" ? "en" : "it"),
    [lang, setLang],
  );

  const t = useCallback(
    (key: TranslationKey) => translations[lang][key] ?? key,
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation must be used inside LanguageProvider");
  return ctx;
}
