# Spec Delta

## Purpose

Defines the pricing page: which plans Danamus offers, what each plan includes, how a plan that is not available yet is shown, and how the page relates to the rest of the site.

## ADDED Requirements

### Requirement: The pricing page shows the Free and Pro plans
The site SHALL have a pricing page at `/prezzi`, in Italian, showing two plans side by side: Free at €0 and Pro at €5 per month. Each plan SHALL show its name, price and the list of what it includes. Plan names, prices and features SHALL come from one site configuration.

#### Scenario: Plans shown
- **WHEN** a visitor opens `/prezzi`
- **THEN** the page shows the Free plan at €0 and the Pro plan at €5 per month, each with its feature list

#### Scenario: Price changes
- **WHEN** the Pro price is changed in the site configuration
- **THEN** the pricing page shows the new price without changes to the page code

### Requirement: The Free plan includes analysis, editor and full export
The Free plan SHALL list on-device analysis, the editor for refining the rallies, and export of the full cut video.

#### Scenario: Free plan contents
- **WHEN** a visitor reads the Free plan
- **THEN** it lists analysis, the editor and export of the full video

### Requirement: The Pro plan lists its extra features
The Pro plan SHALL list, in addition to everything in Free: export of single rallies as separate clips, a more precise analysis, an analysis queue that processes several videos automatically, and automatic upload to YouTube.

#### Scenario: Pro plan contents
- **WHEN** a visitor reads the Pro plan
- **THEN** it says it includes everything in Free plus single-rally export, more precise analysis, the analysis queue and automatic YouTube upload

### Requirement: Unavailable plans are marked "In arrivo"
A plan that cannot be bought yet SHALL be marked "In arrivo" and SHALL NOT offer a purchase, sign-up or payment action. The Pro plan SHALL be in this state.

#### Scenario: Pro not available
- **WHEN** a visitor reads the Pro plan
- **THEN** it is labelled "In arrivo" and has no button or link to buy or subscribe

#### Scenario: Free plan action
- **WHEN** a visitor reads the Free plan
- **THEN** its action leads to the download calls to action, which show "In arrivo" for platforms without a download link

### Requirement: The pricing page notes on-device processing and device-dependent speed
The pricing page SHALL say that the analysis runs on the visitor's device in every plan, and that analysis time depends on the device.

#### Scenario: Notes on the pricing page
- **WHEN** a visitor reads the pricing page
- **THEN** it says analysis runs on the device in every plan and that its speed depends on the device

### Requirement: Pricing copy avoids negation claims
The pricing page MAY describe the Pro price as monthly, but SHALL NOT use negation claims about subscriptions or hidden costs (for example "nessun abbonamento" or "nessun costo nascosto").

#### Scenario: No negation claims
- **WHEN** the pricing page text is searched for "nessun abbonamento" or "nessun costo"
- **THEN** no match is found
