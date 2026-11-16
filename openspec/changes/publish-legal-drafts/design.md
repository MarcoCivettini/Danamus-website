# Design

## Context

`scripts/check-legal.mjs` parses the `legal` block of `src/site.config.ts` with regular expressions. It exits 1 when `draft: true` or when a value is bracketed or empty (`vat` may be empty). The Pages workflow runs it before the build.

## Decisions

1. **Draft → warning, exit 0.** With `draft: true` the script prints one GitHub Actions annotation per missing field (`::warning title=Legal pages draft::<field> is still a placeholder`) and a plain summary line, then exits 0. The annotations show up on the run page without opening the log. Outside Actions the same lines are harmless text.
2. **Not draft → strict, exit 1.** With `draft: false` the current rules stay: any bracketed or empty value (except `vat`) fails with `::error` annotations.
3. **The workflow is untouched.** Keeping the step means the strict rule still guards the moment the draft flag is cleared.

*Alternative considered:* removing the step from the workflow. Rejected, because nothing would then stop `draft: false` from going out with placeholders.

## Risks / Trade-offs

- **The public privacy notice lacks the controller's identity** → the "Bozza" banner says the text is not final. The README and the run warnings remind the user to fill the details in.
