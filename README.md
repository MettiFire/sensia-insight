# Sensia Insight

Crea un'applicazione mobile-first completa per "Sensia", una piattaforma che acquisisce biometrici Garmin ed elabora metriche cognitive ed emotive in tempo reale tramite le API di Sensia.bio.

### DESIGN SYSTEM & PALETTE

- **Accent Color Principale:** `#6d5ffc` (usalo per pulsanti primari, anelli di avanzamento, stati attivi della navbar, bordi attivi e gradienti).

- **Temi (Chiaro / Scuro):**

  - Supporta Dark Mode e Light Mode tramite classe `dark` su Tailwind e Context React dedicato.

  - **Dark Mode (Default):** Sfondo principale `bg-slate-950`, card `bg-slate-900/90 border border-slate-800`, testi `text-slate-100` e secondari `text-slate-400`.

  - **Light Mode:** Sfondo principale `bg-slate-50`, card `bg-white border border-slate-200`, testi `text-slate-900` e secondari `text-slate-600`.

- **Viewport Mobile Frame:** Racchiudi l'app dentro un mockup/container stile smartphone (larghezza 390px-420px, altezza 844px centrata a schermo, con bordo arrotondato, ombra e status bar fittizia in alto con orario e icone batteria/wifi).

- Icone da `lucide-react`.

---

### INTERNAZIONALIZZAZIONE (i18n Context / Hook)

- Crea un sistema leggero di traduzione (`/src/context/LanguageContext.tsx`) con supporto a **Italiano (default)** e **Inglese**.

- Tutte le stringhe di testo dell'app (onboarding, label metriche, stati, impostazioni) devono essere gestite tramite un dizionario `translations = { it: {...}, en: {...} }` e richiamate con un hook `useTranslation()`.

---

### MODELLO DATI (File `/src/types/sensia.ts`)

Definisci e implementa con TypeScript:

1. `UserProfile`: { fullName: string; age: number; gender: 'M' | 'F' | 'Other'; weightKg: number; heightCm: number; isGarminConnected: boolean; }

2. `CognitiveMetrics` (Output Sensia API):

   - `cScore`: number (0-100)

   - `memory`: number (0-100)

   - `reasoning`: number (0-100)

   - `attention`: number (0-100)

   - `arousal`: number (-1.0 a +1.0 o 0-100)

   - `valence`: number (-1.0 a +1.0 o 0-100)

   - `cognitiveStress`: number (0-100, con badge: Low / Moderate / High)

3. `GarminRawBiometrics`:

   - `heartRate`: number; `hrv`: number; `bodyBattery`: number; `stressLevel`: number; `sleepScore`: number; `steps`: number; `spo2`: number; `respiration`: number;

4. `ConnectionState`: { isLive: boolean; lastSync: string; apiLatencyMs: number; }

---

### LOGICA DI SIMULAZIONE (Hook `/src/hooks/useSensiaStream.ts`)

- Simula l'acquisizione real-time ogni 1.5 secondi: calcola le metriche cognitive ed emotive Sensia a partire dalle oscillazioni biometriche Garmin (es. se HRV cala e FC sale, lo stress cognitivo aumenta).

- Salva preferenze (lingua, tema, profilo) in `localStorage` per persistenza tra i refresh.

---

### FLUSSO DELLE SCHERMATE

#### 1. ONBOARDING (Mostrato solo se profilo non completato o reset)

- **Header Onboarding:** Icone rapide in alto per cambiare lingua (IT/EN) e tema (sole/luna).

- **Step 1 (Welcome):** Logo placeholder "SENSIA" con accento color `#6d5ffc`, titolo accattivante ("Biometria Cognitiva ed Emotiva in Tempo Reale"), descrizione del valore scientifico con le API Sensia.bio e pulsante CTA "Inizia Configurazione".

- **Step 2 (Dati Personali & Pairing Garmin):**

  - Form validato con campi obbligatori: Nome Completo, Età, Sesso (Select: Maschio/Femmina/Altro), Peso (kg), Altezza (cm).

  - Sezione Pairing Garmin Connect: Card interattiva con pulsante "Collega Account Garmin". Al clic simula autenticazione con spinner/animazione prima di mostrare "Garmin Collegato" con badge verde.

  - Tasto CTA finale con sfondo `#6d5ffc`: "Entra nella Dashboard" (attivo solo con campi validi e Garmin connesso).

#### 2. MAIN APP (Con Bottom Navigation Bar fissa a 3 schede)

##### TAB 1: "Sensia Mind" (Dashboard Cognitiva Principale)

- **Header:** "Ciao, {Nome}" / "Hello, {Nome}" con selettore rapido Dark/Light e IT/EN compatto, indicatore di connessione live (pallino verde pulsante "Live Streaming" o rosso "Offline" cliccabile per simulare disconnessione) e latenza API (es. `42ms`).

- **Cognitive States (Griglia 2x2):**

  - C-Score (indicatore radiale grande color `#6d5ffc`)

  - Memory (icona Brain)

  - Reasoning (icona Cpu/Network)

  - Attention (icona Focus/Target)

  *Ogni card include: valore numerico reattivo, icona dedicata e freccia di trend.*

- **Emotional States (2 card orizzontali):**

  - Arousal (Attivazione: valore numerico + barra bipolare)

  - Valence (Valenza emotiva: valore numerico con indicatore cromatico)

- **Card Focus: "Cognitive Stress":** Barra di intensità grande con stato dinamico (Basso/Moderato/Alto) correlata ai valori biometrici attuali.

##### TAB 2: "Garmin Vitals" (Dati Biometrici Grezzi Hardware)

- Frequenza cardiaca live (BPM) con grafico temporale reattivo a linea sfumata verso `#6d5ffc`.

- Body Battery & Livello di Stress Garmin a confronto.

- Card Sonno (Punteggio, ore totali, breakdown fasi sonno).

- Passi giornalieri con barra di avanzamento, SpO2 e Frequenza respiratoria.

- Info box esplicativo sul processing dei dati tramite Sensia.bio.

##### TAB 3: "Profilo & Impostazioni"

- Riepilogo dati personali inseriti con opzione di modifica.

- **Selettori di sistema:**

  - Lingua (Toggle / Dropdown: Italiano / English).

  - Aspetto (Toggle: Tema Scuro / Tema Chiaro).

- **Sensia.bio API Inspector:**

  - Box di debug formattato stile codice (JSON grezzo) con payload sincronizzato in tempo reale tra Garmin e Sensia.bio, con tasto "Copia JSON".

  - Pulsante "Reset Completo App" per tornare all'onboarding.

---

### REQUISITI TECNICI DI OUTPUT

- Nessun mock statico vuoto: valori numerici animati e realistici.

- Struttura file pulita e modulare: `/src/components/`, `/src/context/`, `/src/types/`, `/src/hooks/`.

- Tutti i colori dell'interfaccia devono rispettare coerentemente `#6d5ffc` come accent primario.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a6b551dd-d651-43b4-b5d0-dd59d618697f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
