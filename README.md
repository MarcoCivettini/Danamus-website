# Danamus — sito vetrina

Landing page di [Danamus](https://github.com/marcocivettini/danamus): Astro (output statico) + Tailwind CSS v4, pnpm.

## Comandi

```bash
corepack enable          # attiva pnpm (versione in package.json)
pnpm install
pnpm dev                 # avvia il server in background (indirizzo nel messaggio)
pnpm astro dev stop      # lo ferma
pnpm build               # sito statico in dist/
pnpm build:preview       # dist-preview/ con URL relativi (anteprima privata)
pnpm check:media-rights  # fallisce se ci sono riprese non autorizzate
pnpm check:legal         # avvisa se privacy e termini sono bozze; fallisce se draft è false ma mancano dati
```

Per provare la build come su GitHub Pages:

```bash
SITE_BASE=/Danamus-website/ pnpm build
```

## Dove sono le cose

| Cosa | Dove |
|---|---|
| Testi delle sezioni | `src/components/sections/` |
| Link di download per piattaforma (`href: null` → "In arrivo") | `src/site.config.ts` |
| Piani e prezzi della pagina `/prezzi` | `src/site.config.ts` (`plans`) |
| Dati del titolare per privacy e termini | `src/site.config.ts` (`legal`) |
| Informativa privacy e termini di servizio | `src/pages/privacy.astro`, `src/pages/termini.astro` |
| Token di colore, spaziature, movimento | `src/styles/tokens.css` (copiati dall'app) |
| Logo e favicon (kit ufficiale, non modificare) | `public/brand/`, `public/` |
| Elenco di screenshot e video | `src/data/media.ts` |
| Screenshot (PNG originali, ottimizzati in build) | `src/assets/media/<piattaforma>/` |
| Video (MP4 già codificati) | `public/media/` |
| Animazioni (GSAP, ScrollTrigger, SplitText, scroll fluido Lenis) | `src/scripts/motion.ts`; stati iniziali in `src/styles/global.css` |

## Privacy e termini

Le pagine `/privacy` e `/termini` sono bozze da far rivedere a un legale. Nome, indirizzo, email, partita IVA del titolare e data di aggiornamento stanno in `legal` dentro `src/site.config.ts`: finché `draft` è `true` le pagine vengono **pubblicate come bozze**, con l'avviso "Bozza" e i segnaposto tra parentesi quadre, e `pnpm check:legal` mostra nel riepilogo della run di GitHub un avviso per ogni dato mancante. Attenzione: in questo stato l'informativa pubblica non dice chi è il titolare, quindi va completata presto. Quando metti `draft: false` il controllo diventa rigido e **il deploy si ferma** se manca anche un solo dato. Le anteprime private funzionano comunque. Se la partita IVA non c'è, lascia `vat: ""`.

Il sito non usa cookie, analytics né risorse di terze parti, quindi non serve un banner di consenso. Se in futuro se ne aggiunge una, va aggiornata l'informativa (e, se serve, aggiunto il consenso) nella stessa change.

L'informativa descrive anche l'app com'è oggi: nessuna connessione di rete, nessuna telemetria. Va aggiornata **prima** che l'app introduca funzioni che inviano dati (account, pagamenti del piano Pro, caricamento su YouTube, aggiornamenti automatici).

## Screenshot e video

Ogni media è dichiarato in `src/data/media.ts` con id, file, piattaforma, testo alternativo, dimensioni, data di cattura e provenienza delle riprese. La build si ferma se un file manca o ha dimensioni diverse da quelle dichiarate.

Per sostituire una cattura basta sovrascrivere il file con lo stesso nome e aggiornare dimensioni e data nel manifest.

La landing mostra solo tre dispositivi: la demo dell'editor nell'hero (estratto `demo-match.mp4`, vedi sotto), la clip del Mac e `ios/editor.png` nella sezione "Sul telefono o sul computer". Queste, più `fullscreen.png` per l'anteprima social, sono le uniche obbligatorie (`requiredMedia`). Le altre restano nel manifest e nel repository ma la pagina non le usa: le altre sezioni sono disegnate in codice (timeline, icone, schema privacy).

Catture attuali (12 nov 2026, Danamus 0.1.0 `5517d29`):

- iOS, simulatore iPhone 13 (1170×2532): `ios/picker.png`, `area.png`, `analysis.png`, `editor.png`, `export.png`, `projects.png`, `fullscreen.png` (2532×1170, usata per l'anteprima social)
- macOS (14 nov 2026, build di produzione, finestra intera 1280×800 a 1x, libreria demo): `macos/editor.png`. La clip `public/media/macos-editor.mp4` (14,5 s, poster in `macos/posters/editor.png`), mostrata nella sezione Piattaforme, è stata registrata di nuovo il 16 nov 2026 sul progetto "KIM KUM YONG vs CHRISTINA KALLBERG", con una libreria temporanea che conteneva solo quel progetto
- Windows: ancora segnaposto (`windows/editor.png`)
- Video (720×1558, max 15 s, registrati di nuovo il 14 nov 2026 con la barra di stato forzata a 9:41): `public/media/analysis.mp4`, `editing.mp4`, `preview.mp4`, con i poster estratti dal primo fotogramma in `ios/posters/`

Da rifare quando possibile: le catture macOS a 2x su uno schermo Retina, e una cattura Windows.

Comandi utili sul Mac. Per non avere notifiche nelle catture: su iOS registra solo lo schermo del simulatore (`simctl`), sul Mac registra solo la finestra dell'app (`screencapture -l` o lo script `record-window.swift`), mai lo schermo intero.

```bash
xcrun simctl status_bar booted override --time 9:41 --batteryLevel 100 --batteryState charged \
  --cellularBars 4 --wifiBars 3 --dataNetwork wifi
xcrun simctl io booted screenshot editor.png
xcrun simctl io booted recordVideo --codec h264 clip.mov      # Ctrl+C per fermare

screencapture -o -l<windowid> home.png                         # una sola finestra, senza ombra
swiftc -O scripts/capture/record-window.swift -o /tmp/record-window   # compila una volta
/tmp/record-window --list                                      # id delle finestre aperte
/tmp/record-window <windowid> 20 editor.mov                    # solo quella finestra, alla densità dello schermo
```

Catture desktop con una libreria demo (così nella barra laterale non compaiono progetti privati):

1. Chiudi Danamus e rinomina `~/Library/Application Support/com.danamus.app` in `com.danamus.app.backup-before-captures`.
2. Riapri l'app (parte vuota), crea il progetto demo con il video ITTF, analizza, cattura.
3. Chiudi l'app, sposta altrove la cartella demo e rinomina il backup in `com.danamus.app`.

Se ffmpeg non è installato, va bene anche quello incluso nella build dell'app (`../Danamus/src-tauri/target/release/ffmpeg`).

Codifica dei video (H.264, senza audio, max 15 s, ~2 MB):

```bash
ffmpeg -i clip.mov -t 12 -vf "scale=720:1558,fps=30" -c:v libx264 -crf 26 -preset slow \
  -pix_fmt yuv420p -an -movflags +faststart public/media/editing.mp4
```

### Demo dell'editor (hero) e timeline

La demo interattiva nell'hero e la timeline della sezione "Perché" usano un progetto vero dell'app, con i segmenti rifiniti a mano: "KIM KUM YONG vs CHRISTINA KALLBERG". Per rigenerarli dopo aver cambiato i segmenti nell'app:

```bash
pnpm make:demo   # opzioni: --project "<nome>" --start 0 --end 140 --db <percorso> --ffmpeg <percorso>
```

Lo script legge il database dell'app in sola lettura (`~/Library/Application Support/com.danamus.app/danamus.db`) e il video originale indicato dal progetto, poi scrive:

- `src/data/demo-project.json`: tutti i segmenti (per la timeline) e quelli dell'estratto (per la demo)
- `public/media/demo-match.mp4`: estratto 0–140 s, 640×360, H.264 senza audio, massimo 3 MB
- `src/assets/media/demo/poster.jpg`: un fotogramma del primo scambio

I tre file vanno committati: la build non dipende dal Mac né dall'app. Usa l'ffmpeg incluso nell'app (`../Danamus/src-tauri/binaries/`) se presente.

### Segnaposto

Finché le catture non ci sono, ogni voce del manifest ha `placeholder: true` e punta a un'immagine "SEGNAPOSTO" generata da:

```bash
pnpm make:placeholders   # crea solo i file mancanti; --force per rigenerarli (serve ffmpeg)
```

Quando arriva una cattura reale: sovrascrivi il file, togli `placeholder: true`, metti `footage: ITTF` (o la fonte vera) e la data di cattura.

### Diritti delle riprese

Le catture mostrano una trasmissione ITTF/WTT (Doha 2025). Il 12 nov 2026 il proprietario del sito ha deciso di pubblicarle, quindi sono `cleared: true`. Se una ripresa non può andare online, mettila a `cleared: false`: il deploy pubblico si ferma (`pnpm check:media-rights`) finché non la sostituisci.

## Pubblicazione su GitHub Pages

Il workflow `.github/workflows/deploy.yml` pubblica a ogni push su `main`. Una sola volta:

1. **Settings → General → Danger Zone → Change repository visibility → Public** (sul piano gratuito Pages richiede un repo pubblico).
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Fai push su `main`, oppure avvia il workflow da **Actions → Deploy to GitHub Pages → Run workflow**.

Il sito sarà su `https://marcocivettini.github.io/Danamus-website/`. Se una build fallisce, resta online la versione precedente.

## Sviluppo

Le modifiche passano da OpenSpec (`/opsx:propose`, `/opsx:apply`, `/opsx:archive`) e prima di ogni push c'è un controllo di sicurezza. Vedi `CLAUDE.md`.
