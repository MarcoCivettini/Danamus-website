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
| Token di colore, spaziature, movimento | `src/styles/tokens.css` (copiati dall'app) |
| Logo e favicon (kit ufficiale, non modificare) | `public/brand/`, `public/` |
| Elenco di screenshot e video | `src/data/media.ts` |
| Screenshot (PNG originali, ottimizzati in build) | `src/assets/media/<piattaforma>/` |
| Video (MP4 già codificati) | `public/media/` |

## Screenshot e video

Ogni media è dichiarato in `src/data/media.ts` con id, file, piattaforma, testo alternativo, dimensioni, data di cattura e provenienza delle riprese. La build si ferma se un file manca o ha dimensioni diverse da quelle dichiarate.

Per sostituire una cattura basta sovrascrivere il file con lo stesso nome e aggiornare dimensioni e data nel manifest.

Catture previste (dall'app reale, sul Mac):

- macOS, finestra 1440×900 punti (file 2880×1800): `macos/picker.png`, `area.png`, `analysis.png`, `editor.png`, `export.png`
- iOS Simulator (iPhone 16 Pro, 1206×2622): `ios/editor.png`, `ios/projects.png`
- Windows (frontend in Chromium sul Mac, 2880×1800): `windows/editor.png`
- Video: `public/media/analysis.mp4`, `editing.mp4`

Comandi utili sul Mac:

```bash
screencapture -o -l<windowid> picker.png                       # finestra senza ombra
xcrun simctl status_bar booted override --time 9:41 --batteryLevel 100 --batteryState charged
xcrun simctl io booted screenshot editor.png
xcrun simctl io booted recordVideo clip.mov
```

Codifica dei video (H.264, senza audio, max 15 s, ~2 MB):

```bash
ffmpeg -i clip.mov -t 12 -vf "scale=1440:-2,fps=30" -c:v libx264 -crf 26 -preset slow \
  -pix_fmt yuv420p -an -movflags +faststart public/media/editing.mp4
```

### Segnaposto

Finché le catture non ci sono, ogni voce del manifest ha `placeholder: true` e punta a un'immagine "SEGNAPOSTO" generata da:

```bash
pnpm make:placeholders   # crea solo i file mancanti; --force per rigenerarli (serve ffmpeg)
```

Quando arriva una cattura reale: sovrascrivi il file, togli `placeholder: true`, metti `footage: ITTF` (o la fonte vera) e la data di cattura.

### Diritti delle riprese

Le catture fatte con la partita ITTF di esempio sono segnate `cleared: false`. Con quelle l'anteprima privata funziona, ma il deploy pubblico si ferma (`pnpm check:media-rights`). Prima di andare online, sostituisci le riprese con una partita tua o autorizzata, oppure imposta `cleared: true` quando hai i diritti.

## Pubblicazione su GitHub Pages

Il workflow `.github/workflows/deploy.yml` pubblica a ogni push su `main`. Una sola volta:

1. **Settings → General → Danger Zone → Change repository visibility → Public** (sul piano gratuito Pages richiede un repo pubblico).
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Fai push su `main`, oppure avvia il workflow da **Actions → Deploy to GitHub Pages → Run workflow**.

Il sito sarà su `https://marcocivettini.github.io/Danamus-website/`. Se una build fallisce, resta online la versione precedente.

## Sviluppo

Le modifiche passano da OpenSpec (`/opsx:propose`, `/opsx:apply`, `/opsx:archive`) e prima di ogni push c'è un controllo di sicurezza. Vedi `CLAUDE.md`.
