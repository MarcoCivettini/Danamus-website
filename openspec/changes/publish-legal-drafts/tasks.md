# Tasks

## 1. Check behaviour

- [x] 1.1 Change `scripts/check-legal.mjs`: with `draft: true` print a `::warning` annotation per placeholder field and exit 0; with `draft: false` keep failing with `::error` annotations on placeholder or empty fields (except `vat`); verify the three cases locally (current config exits 0 with warnings; `draft: false` with placeholders exits 1; `draft: false` with sample values exits 0 with no warnings), restoring the config afterwards
- [x] 1.2 Update the "Privacy e termini" section of the README; verify it describes draft publication with a warning and the strict check once `draft: false`

## 2. Integration

- [x] 2.1 `pnpm build` passes and `openspec validate publish-legal-drafts --strict` passes

## Workflow follow-up

- Security review per CLAUDE.md, push, PR; after merge the Pages deployment publishes the site with the legal drafts.
- `/opsx:archive` after the user verifies the deployed site.
