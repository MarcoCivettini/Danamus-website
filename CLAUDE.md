# Danamus-website

Sito vetrina del prodotto Danamus (l'app vive nel repository `marcocivettini/danamus`, qui non si sviluppa).

## Workflow di sviluppo: OpenSpec

Ogni modifica al sito (pagine, componenti, contenuti strutturali, fix, refactor) va sviluppata tramite OpenSpec:

1. **Proposta** — `/opsx:propose` (o `/opsx:explore` per chiarire prima il problema) crea in `openspec/changes/<nome>/` proposal, design, delta spec e tasks.
2. **Revisione** — la proposta va fatta approvare all'utente prima di scrivere codice.
3. **Implementazione** — `/opsx:apply`, seguendo i task della change.
4. **Archiviazione** — `/opsx:archive` dopo che l'utente ha verificato a mano il risultato.

Non modificare il codice del sito fuori da una change OpenSpec. Fanno eccezione solo le modifiche banali (typo, configurazione locale) o quando l'utente chiede esplicitamente di saltare il flusso.

Contesto del prodotto, brand e vincoli sono in `openspec/config.yaml`; le specifiche correnti in `openspec/specs/`. Stack: Astro (statico) + Tailwind CSS v4, pnpm, deploy su GitHub Pages (dettagli in `openspec/config.yaml` e nel README).

## Controllo di sicurezza prima di ogni push

Prima di ogni `git push` va fatto un controllo di sicurezza delle modifiche con la skill `security-audit` (Cloudflare), in **guidance mode** (revisione mirata, senza audit completo né file di report, salvo richiesta esplicita):

1. Rivedi il diff che stai per pushare (`git diff $(git merge-base HEAD origin/main)...HEAD`), comprese nuove dipendenze, configurazione di MCP/skill/hook, script esterni e possibili segreti committati.
2. Riporta all'utente i problemi trovati; correggi o fatti approvare quelli reali prima di procedere.
3. Solo allora registra la revisione con `git rev-parse HEAD > .claude/.security-review-ok` e fai il push.

L'hook `.claude/hooks/pre-push-security.sh` blocca i `git push` di Claude se l'HEAD corrente non è stato revisionato, e blocca il push diretto via API GitHub (`push_files`, `create_or_update_file`, `delete_file`).

## Tool di UI disponibili

- Skill: `transitions-dev`, `transitions-polish` (transitions.dev), `security-audit`.
- MCP (`.mcp.json`): OriginKit, 21st.dev (chiavi in `ORIGINKIT_API_KEY` / `API_KEY_21ST`, mai nel repo), Agentation.
- Riferimenti da consultare senza installare: Aceternity UI (ui.aceternity.com), Component Gallery (component.gallery).

## Pull request

Il titolo di ogni PR segue il formato dei conventional commit: `feat: <descrizione>` per nuove funzionalità, `fix: <descrizione>` per le correzioni, in inglese e breve.
