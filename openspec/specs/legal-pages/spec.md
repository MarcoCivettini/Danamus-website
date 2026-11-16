# legal-pages Specification

## Purpose
Defines the site's privacy notice and terms of service, what they must state about the website and the Danamus app, and the data-protection baseline the website must keep (no cookies, trackers or third-party requests) so that it stays compliant with the GDPR without a consent banner.

## Requirements

### Requirement: The site has a privacy notice
The site SHALL have a privacy notice at `/privacy`, in Italian, covering both the website and the Danamus app, written in plain language as required by GDPR articles 12 and 13.

#### Scenario: Privacy notice reachable
- **WHEN** a visitor activates "Privacy" in the footer of any page
- **THEN** the privacy notice opens

### Requirement: The privacy notice states the GDPR article 13 information
The privacy notice SHALL state: the controller's identity and contact; for each processing, the data, the purpose, the lawful basis and the retention period; the recipients and processors, with any transfer outside the EEA and its safeguard; the data subject's rights; the right to lodge a complaint with the Garante per la protezione dei dati personali; and the date of the last update.

#### Scenario: Required sections present
- **WHEN** a reviewer reads the privacy notice
- **THEN** it has sections for controller, data and purposes, lawful basis, retention, recipients and transfers, rights, complaint, and last update date

### Requirement: The privacy notice describes the website's processing
For the website, the privacy notice SHALL say that the site sets no cookies and uses no analytics or tracking, and that the hosting provider (GitHub Pages) processes visitors' IP addresses and request data in its server logs to deliver and secure the site, with the provider named as recipient and the transfer to the United States and its safeguard stated.

#### Scenario: Website section
- **WHEN** a reviewer reads the website part of the privacy notice
- **THEN** it says there are no cookies and no analytics, names GitHub as hosting provider, and explains the server logs and the transfer to the United States

### Requirement: The privacy notice describes the app's processing
For the app, the privacy notice SHALL say that videos and analysis results are processed and stored only on the user's device and are not sent to the controller, and that the app sends no usage data or telemetry. It SHALL say that the notice will be updated before features that send data (accounts, payments, YouTube upload, automatic updates) are released.

#### Scenario: App section
- **WHEN** a reviewer reads the app part of the privacy notice
- **THEN** it says videos stay on the device, no telemetry is collected, and the notice will change before data-sending features ship

### Requirement: The site has terms of service
The site SHALL have terms of service at `/termini`, in Italian, covering: who provides the service, the licence to use the app, acceptable use, the user's responsibility for the videos they record and share (including consent of the people filmed), that paid plans will have their own conditions when available, limitation of liability within the limits of the law, changes to the terms, governing law, and the last update date.

#### Scenario: Terms reachable and complete
- **WHEN** a visitor activates "Termini" in the footer and reads the page
- **THEN** it covers provider, licence, acceptable use, user content and consent, paid plans, liability, changes, governing law and last update date

### Requirement: Legal pages show unfilled controller details as placeholders
The controller's name, address, contact email and the last update date SHALL come from one site configuration. Until they are filled in, they SHALL appear on the page as visible placeholders in square brackets, and the pages SHALL show a notice that the text is a draft.

#### Scenario: Details not yet provided
- **WHEN** the configuration still holds placeholder values
- **THEN** the legal pages show the bracketed placeholders and a draft notice

#### Scenario: Details provided
- **WHEN** the controller details are set in the configuration and the draft flag is cleared
- **THEN** the legal pages show the real details and no draft notice, without changes to the page code

### Requirement: The public deployment refuses draft legal pages
The public deployment SHALL fail while the legal pages still contain placeholders or the draft flag is set, naming what is missing. Private previews SHALL still build.

#### Scenario: Deploy with placeholders
- **WHEN** the public deployment runs and the controller email is still a placeholder
- **THEN** the deployment fails and names the missing field

#### Scenario: Preview with placeholders
- **WHEN** a private preview is built with placeholders
- **THEN** the build succeeds and the pages show the draft notice

### Requirement: The website sets no cookies and loads no third-party resources
The website SHALL NOT set cookies, SHALL NOT store personal data in browser storage, SHALL NOT load analytics, tracking pixels or embeds, and SHALL NOT request resources from third-party origins. It SHALL therefore show no consent banner.

#### Scenario: First visit
- **WHEN** a visitor loads any page with an empty browser profile
- **THEN** no cookie is set, every request goes to the site's own origin, and no consent banner is shown

#### Scenario: Adding a third-party service
- **WHEN** a third-party script, embed or analytics tool is proposed for the site
- **THEN** it requires a change that updates the privacy notice and, if it needs consent, adds a consent mechanism before it loads
