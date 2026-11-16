# Design

## Context

- The site is a single Astro page (`src/pages/index.astro`) built from section components. The nav and footer use bare hash links (`#come-funziona`). `motion.ts` smooth-scrolls only `a[href^="#"]` links.
- The page title and description are in `site.config.ts` and apply to every page through `Base.astro`, which takes only `ogImage`.
- The private preview (`build:preview`) rewrites root-relative URLs to relative ones by directory depth, so sub-pages in `prezzi/index.html` already resolve.
- The deploy workflow already runs one gate before the build (`check:media-rights`).
- The app (separate repo) makes no network requests today: its CSP allows only local and IPC origins, and it has no telemetry, updater or account. Backlog items 010 (YouTube upload) and 024 (auto-update) will change that.
- The website sets no cookies, uses no browser storage, self-hosts Inter and calls no third-party origin.
- Copy rules applied: the copywriting skill's three-question gate, no negation lists, no "non X ma Y", no self-answered questions or colon reveals, no em dashes in short copy, one or two punchy lines per page, CTAs as verb plus outcome. The humanizer skill adds: no forced triads, no inflated words, no restating the heading in the first line, no decorative bold.

## Goals / Non-Goals

**Goals:**
- Final Italian copy for every section and page, reviewed here before implementation.
- Two text pages and one pricing page that reuse the existing layout, tokens and nav.
- A deploy gate that keeps placeholder legal text off the public site.

**Non-Goals:**
- Changing the app, adding accounts, payments or any form.
- New captures, except reusing ones already in the manifest.
- A cookie or consent banner: none is needed while the site keeps no cookies and no third-party requests.
- Legal advice. The privacy notice and terms are drafts for a lawyer to review.
- An English version.

## Decisions

### 1. Page copy (final draft)

Alternatives for the main lines are listed so the user can swap them during review.

**Metadata**
- Title: `Danamus · Rivedi solo il gioco delle tue partite di ping pong`
- Description: `Registri la partita con il telefono, Danamus trova gli scambi e taglia le pause. L'analisi avviene sul tuo dispositivo. Gratis per iPhone, Mac e Windows.`

**Hero**
- Eyebrow: `Per il ping pong`
- H1: `Rivedi solo il gioco.` (alt: `La partita, senza le pause.` / `Solo gli scambi. Niente attese.`)
- Subhead: `Metti il telefono sul cavalletto e registra la partita. Danamus trova gli scambi e taglia le pause, così rivedi solo i punti giocati.`
- Under the CTA: `Gratis, su telefono e computer.`
- Media: unchanged (`clip-preview` in a phone frame).

**Problem** (new section, id `perche`)
- Eyebrow: `Perché Danamus`
- H2: `Venti minuti di video, cinque di gioco.`
- Three figures (big number + caption):
  - `20 min` · `il video di una partita tipica`
  - `5 min` · `il tempo in cui si gioca davvero`
  - `1 ora` · `circa, per tagliarlo a mano`
- Body: `Riguardarti è il modo più rapido per capire come giochi: dove sbagli il servizio, quando resti troppo lontano dal tavolo. Il problema è tutto il resto. Uno scambio dura in media 3 o 4 secondi, e tra un punto e l'altro ci sono palline da raccogliere, pause e cambi di campo. Riguardare la registrazione intera vuol dire aspettare quindici minuti per vederne cinque.`
- Source for "3 o 4 secondi": the review in PMC8623913 and the study in J. Hum. Kinet. 2016 (doi 10.1515/hukin-2016-0048). Kept in a code comment, not on the page.

**Come funziona**
- Eyebrow: `Come funziona`
- H2: `Dal video intero al solo gioco.`
- Lead under H2: `Danamus fa quasi tutto da solo. Se vuoi un risultato perfetto, ritocchi i dettagli nell'editor.`
- Steps:
  1. `Scegli il video` · `Apri la registrazione dal telefono o dal computer. Il file resta dove si trova.`
  2. `Segna il tavolo` · `Trascini gli angoli attorno al tavolo, così l'analisi guarda solo lì e ignora il resto della stanza.`
  3. `Danamus trova gli scambi` · `Il modello segue la pallina fotogramma per fotogramma e separa il gioco dalle pause. Intanto puoi lavorare su altri progetti.` Note (caption style, muted): `La durata dell'analisi dipende molto dal dispositivo.`
  4. `Rifinisci a mano` · `Ogni scambio è un segmento sulla timeline. Lo allunghi se è stato tagliato presto, lo scarti se è una pausa. L'editor è pensato per le partite di ping pong.`
  5. `Esporta` · `Salvi un video con solo gli scambi, nel Rullino o sul disco, pronto da rivedere o da mandare agli amici.`

**Per chi è** (new section, id `per-chi`)
- Eyebrow: `Per chi è`
- H2: `Un telefono, un cavalletto, la partita.`
- Three items (title + one sentence):
  - `Creator` · `Porti il ping pong sui social con video fatti di scambi, senza passare la serata a montare.`
  - `Chi si allena` · `Ti registri, rivedi solo i punti e capisci cosa cambiare prima del prossimo allenamento.`
  - `Chi vuole rivedersi` · `Ritrovi i punti migliori della partita con gli amici e glieli mandi la sera stessa.`

**Privacy**
- Eyebrow: `Sul tuo dispositivo`
- H2: `La partita resta tua.`
- Body: `L'analisi avviene sul tuo telefono o sul tuo computer, anche nel piano gratuito. Il video non passa dai nostri server ed esce dal dispositivo solo quando decidi di condividerlo.`
- The figures block ("Video caricati online: 0") is removed. It would become ambiguous once the YouTube upload exists.
- Media: `ios-projects` (project list on iPhone) replaces `ios-log`.

**Telefono e computer** (replaces Platforms, keeps id `piattaforme`)
- Eyebrow: `iPhone · Mac · Windows`
- H2: `Sul telefono o sul computer.`
- Body: `Puoi fare tutto dal telefono, dalla registrazione all'export. Se preferisci uno schermo grande, Danamus funziona anche su Mac e Windows.`
- Media: two items instead of three, `clip-macos-editor` in a window frame and `ios-editor` in a phone frame. The Windows placeholder is no longer shown.

**Pricing teaser** (new section)
- Eyebrow: `Prezzi`
- H2: `Gratis per rivedere le tue partite.`
- Body: `Analisi, editor ed esportazione del video completo sono gratuiti. Per chi registra e pubblica spesso arriverà il piano Pro.`
- Link: `Confronta i piani` → `/prezzi`

**Final CTA**
- H2: `La prossima partita, rivedila senza pause.` (alt: `Registra la prossima partita.`)
- Body: `Danamus per iPhone, Mac e Windows. Gratis.`
- CTA: unchanged platform buttons.

**Nav**: `Come funziona` · `Per chi è` · `Prezzi` · button `Scarica`. "Privacy" moves to the footer, where it links to the privacy notice.

**Footer**: logo · `Prezzi` · `Privacy` · `Termini` · `© <year> Danamus`.

### 2. Pricing page copy (`/prezzi`)

- Title: `Prezzi · Danamus`. Description: `Danamus è gratis: analisi, editor ed export del video completo. Il piano Pro da 5 € al mese è in arrivo.`
- Eyebrow `Prezzi`, H1 `Scegli il piano.`, lead `Il piano Free basta per rivedere le tue partite. Pro aggiunge strumenti per chi registra e pubblica tanto.`
- Free · `0 €`
  - `Analisi automatica degli scambi`
  - `Editor per rifinire ogni scambio`
  - `Esportazione del video con tutti gli scambi`
  - Action: `Scarica Danamus` → landing `#scarica`
- Pro · `5 € al mese` · badge `In arrivo`
  - `Tutto quello che c'è in Free, più:`
  - `Esportazione dei singoli scambi come clip separate`
  - `Analisi Pro, più precisa`
  - `Coda di analisi: aggiungi più video e Danamus li elabora uno dopo l'altro`
  - `Caricamento automatico su YouTube`
  - No action. A muted non-interactive label `In arrivo` in place of a button.
- Notes under the plans: `In tutti i piani l'analisi avviene sul tuo dispositivo, e la sua durata dipende molto dal dispositivo che usi.` · `Prezzi IVA inclusa.`
- Rationale for "IVA inclusa": prices shown to consumers in Italy must be final prices (Codice del Consumo, art. 13 and 17 of d.lgs. 206/2005 on price indication).
- Plans live in `site.config.ts` (`plans: [{ id, name, price, period, features, status: "available" | "soon" }]`), as the spec requires.

### 3. Legal pages

A shared `TextPage` layout (Base + Nav + a narrow prose column + Footer) serves `/privacy` and `/termini`. A draft banner at the top reads `Bozza: questo testo non è ancora definitivo e verrà rivisto prima della pubblicazione.` while `legal.draft` is true.

Config (`site.config.ts`):
```ts
legal: {
  draft: true,
  controller: "[Nome e cognome o ragione sociale]",
  address: "[Indirizzo]",
  email: "[email di contatto]",
  vat: "[Partita IVA, se presente]",
  updated: "[data ultimo aggiornamento]",
}
```

Privacy notice outline (art. 13 GDPR):
1. Titolare del trattamento: controller, address, email.
2. Il sito: no cookies, no analytics, no browser storage. GitHub Pages (GitHub, Inc., USA) receives IP address, date and time, requested page, browser and referrer in its server logs to deliver the site and protect it from abuse. Lawful basis art. 6(1)(f), legitimate interest in delivering and securing the site. Transfer to the USA under the EU-US Data Privacy Framework, to be verified against GitHub's current certification at implementation. Retention governed by GitHub's policy, with a link to the GitHub Privacy Statement.
3. L'app: videos, analysis results and projects are processed and stored only on the device. Nothing reaches the controller. No usage data, telemetry or crash reports. The app stores of distribution (App Store and others) process download and purchase data as independent controllers under their own notices.
4. Funzioni future: before accounts, payments, YouTube upload or automatic updates are released, this notice will be updated, saying what data is sent, to whom and why.
5. Contatti via email: if a user writes, their email and message are used only to reply (art. 6(1)(b)/(f)) and kept for as long as the exchange needs.
6. Diritti: access, rectification, erasure, restriction, portability, objection (art. 15–21), how to exercise them (the email above) and the one-month response time.
7. Reclamo: right to lodge a complaint with the Garante per la protezione dei dati personali (garanteprivacy.it).
8. Ultimo aggiornamento: `legal.updated`.

Terms outline: chi fornisce il servizio; cosa fa Danamus; licenza d'uso personale e non esclusiva; uso consentito (no unlawful use, no reverse engineering beyond what the law allows); i tuoi video (they stay the user's; the user is responsible for having the consent of the people filmed and the rights to what they share, for example on YouTube); piani a pagamento (Pro is not available yet and will have its own conditions, price and withdrawal rights when it launches); risultati dell'analisi (automatic and possibly imprecise, editable by hand); responsabilità (limited within the limits of Italian consumer law, never excluding non-excludable liability); modifiche ai termini; legge applicabile (Italian law, consumer forum per Codice del Consumo); ultimo aggiornamento.

### 4. Deploy gate for legal placeholders

`scripts/check-legal.mjs` reads `legal` from `site.config.ts` with a regex, as `check-media-rights.mjs` does. It fails if `draft` is true or any value still matches `^\[.*\]$`, and names each field. It runs in `deploy.yml` next to `check:media-rights`. `build` and `build:preview` do not run it, so previews keep working.
Alternative considered: failing inside the Astro build when `SITE_BASE` is set. Rejected because it couples the gate to an unrelated variable, and the existing gate pattern is a separate script.

### 5. Links across pages

`Nav` and `Footer` receive the current page. On the landing page, section links stay `#id`, so the existing smooth-scroll and focus handling keep working. On other pages they become `withBase("/#id")`. Page links always use `withBase("/prezzi/")` and similar, with the trailing slash matching `build.format: "directory"`.
Alternative: always use `/#id`. Rejected because `motion.ts` only intercepts `a[href^="#"]`, so smooth scrolling and focus handling on the landing page would be lost.

### 6. Per-page metadata

`Base.astro` gains optional `title`, `description` and `ogImage` props with the `site.config` values as defaults. Sub-pages reuse the landing page's OG image.

### 7. Media

`ios-log` is removed from `requiredMedia` and from the manifest. Its file is deleted, since nothing else uses it. `windows-editor` (a placeholder) stays in the manifest, because the spec only needs at least one desktop and one phone capture, but it is no longer shown. `ios-projects` is already required.

## Risks / Trade-offs

- [The 20/5-minute and one-hour figures are the author's estimates] → They are worded as "tipica" and "circa". The only cited fact (3–4 s per rally) has sources in a code comment.
- [Legal drafts mistaken for final text] → A visible draft banner, bracketed placeholders and a deploy gate that blocks publication.
- [GitHub's DPF status or log retention changes] → The notice links to GitHub's own privacy statement instead of restating its retention. Verify the certification during implementation.
- [The privacy notice drifts from the app when Pro features ship] → The notice says it will change first, and the proposal's Impact flags it for the app repo.
- [Fewer platform captures weakens "works everywhere"] → The section names all three systems in text and shows one desktop and one phone capture, which the user asked for.
- [Removing NoSubscription changes the page rhythm and motion triggers] → The new sections reuse the existing `data-reveal` and `data-split` patterns, so no new motion code is needed.

## Migration Plan

Static site: merge to `main` and the workflow deploys. After this change the deploy fails until `legal` is filled in, which is intended. Fill in the controller details and clear `draft` once a lawyer has reviewed the texts. Rollback: revert the merge commit.
