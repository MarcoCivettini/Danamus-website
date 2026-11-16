# Proposal

## Why

The GitHub Pages deployment of `main` (run 43917036804) stops at `pnpm check:legal`: the controller details in `src/site.config.ts` are not available yet, so the new site (copy, pricing page, editor demo) cannot go online. The user has chosen to publish now, with the privacy notice and terms visible as drafts, and to fill in the details later.

## What Changes

- **BREAKING (legal-pages)**: a public deployment no longer fails while the legal pages are drafts (`draft: true`). It publishes them with the "Bozza" notice and the bracketed placeholders, and the check prints a warning that names each missing field. The warning appears in the workflow run summary.
- The check still fails in one case: `draft: false` while a field is a placeholder or empty (except the VAT number). Clearing the draft flag must mean the details are really filled in.
- README: the "Privacy e termini" section explains the new behaviour and that the drafts are public until filled in.

No change to the pages themselves: they already show the draft notice and placeholders.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `legal-pages`: the requirement "The public deployment refuses draft legal pages" is replaced by one that allows draft publication with a warning and blocks only an inconsistent non-draft configuration.

## Impact

- `scripts/check-legal.mjs`, README. The workflow step `pnpm check:legal` stays as it is.
- Until the details are filled in, the public site shows a privacy notice without the controller's identity. That is incomplete under GDPR art. 13, and it is visible to visitors: the user accepts this as temporary.
