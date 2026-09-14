import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Onboarding } from "@/components/Onboarding";
import { BottomNav, type TabId } from "@/components/BottomNav";
import { MindTab } from "@/components/MindTab";
import { VitalsTab } from "@/components/VitalsTab";
import { ProfileTab } from "@/components/ProfileTab";
import { useProfile } from "@/hooks/useProfile";
import { useSensiaStream } from "@/hooks/useSensiaStream";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sensia — Biometria cognitiva ed emotiva in tempo reale" },
      {
        name: "description",
        content:
          "Sensia acquisisce i biometrici Garmin ed elabora metriche cognitive ed emotive in tempo reale tramite le API Sensia.bio.",
      },
      { property: "og:title", content: "Sensia — Cognitive & Emotional Biometrics" },
      {
        property: "og:description",
        content:
          "Streaming live di C-Score, memoria, ragionamento, attenzione, arousal e valenza dai dati Garmin.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function SensiaApp() {
  const { profile, setProfile, reset, loaded } = useProfile();
  const [tab, setTab] = useState<TabId>("mind");
  const { garmin, cognitive, connection, history, toggleLive } = useSensiaStream(
    Boolean(profile),
  );

  if (!loaded) return <PhoneFrame>{null}</PhoneFrame>;

  if (!profile) {
    return (
      <PhoneFrame>
        <Onboarding onDone={setProfile} />
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <main className="min-h-0 flex-1 overflow-y-auto">
        {tab === "mind" ? (
          <MindTab
            name={profile.fullName.split(" ")[0] ?? profile.fullName}
            cognitive={cognitive}
            connection={connection}
            onToggleLive={toggleLive}
          />
        ) : null}
        {tab === "vitals" ? <VitalsTab garmin={garmin} history={history} /> : null}
        {tab === "profile" ? (
          <ProfileTab
            profile={profile}
            onSave={setProfile}
            onReset={() => {
              reset();
              setTab("mind");
            }}
          />
        ) : null}
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </PhoneFrame>
  );
}

function Index() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SensiaApp />
      </LanguageProvider>
    </ThemeProvider>
  );
}
