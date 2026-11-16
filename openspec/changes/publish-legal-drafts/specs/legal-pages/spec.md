# Spec Delta

## ADDED Requirements

### Requirement: The public deployment warns about draft legal pages
While the draft flag is set, the public deployment SHALL publish the legal pages as drafts and SHALL report a warning naming each field that is still a placeholder. When the draft flag is cleared, the deployment SHALL fail if any controller detail, other than an inapplicable VAT number, is still a placeholder or empty, naming the field. Private previews SHALL build in every case.

#### Scenario: Deploy with draft pages
- **WHEN** the public deployment runs with the draft flag set and placeholder details
- **THEN** the deployment succeeds, the legal pages show the draft notice and placeholders, and the run reports a warning naming the missing fields

#### Scenario: Draft cleared too early
- **WHEN** the public deployment runs with the draft flag cleared and the controller email still a placeholder
- **THEN** the deployment fails and names the missing field

#### Scenario: Details complete
- **WHEN** the draft flag is cleared and every required detail is filled in
- **THEN** the check passes without warnings

#### Scenario: Preview with placeholders
- **WHEN** a private preview is built with placeholders
- **THEN** the build succeeds and the pages show the draft notice

## REMOVED Requirements

### Requirement: The public deployment refuses draft legal pages
**Reason**: The controller details are not available yet, and the user chose to publish the new site with the legal pages visible as drafts instead of blocking the whole deployment.
**Migration**: Replaced by "The public deployment warns about draft legal pages": drafts are published with a warning, and only a cleared draft flag with missing details blocks the deployment.
