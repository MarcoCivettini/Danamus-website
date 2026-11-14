# Landing Page Specification

## Purpose

Defines the content and structure of the Danamus landing page: which sections it shows, in which order, what each one says, how the platforms and calls to action are presented, and the page's language and metadata.

## Requirements

### Requirement: The page presents the product in a fixed sequence of sections
The landing page SHALL be a single page showing, in this order: navigation bar, hero, "come funziona" walkthrough, on-device privacy section, no-subscription section, platforms section, final call to action, footer.

#### Scenario: Visitor scrolls the whole page
- **WHEN** a visitor opens the site root and scrolls to the bottom
- **THEN** the sections appear in the order navigation, hero, come funziona, privacy, no subscription, platforms, final call to action, footer

### Requirement: The page is written in Italian
All visible text, the page title and the meta description SHALL be in Italian, and the document SHALL declare `lang="it"`.

#### Scenario: Language declared
- **WHEN** the page is loaded
- **THEN** the `html` element has `lang="it"` and the title and description are in Italian

### Requirement: The hero states what Danamus does
The hero SHALL show the Danamus logo or name, a headline saying that Danamus removes the dead time from table-tennis match videos automatically, a short line naming the three platforms (Windows, macOS, iOS), the primary call to action, and a real screenshot of the app inside a device frame.

#### Scenario: First screen on desktop
- **WHEN** the page is opened in a 1440x900 viewport
- **THEN** the headline, the platforms line, the primary call to action and the app screenshot are visible without scrolling

#### Scenario: First screen on a phone
- **WHEN** the page is opened in a 390x844 viewport
- **THEN** the headline and the primary call to action are visible without scrolling

### Requirement: The walkthrough follows the app's real flow
The "come funziona" section SHALL present five steps in the order of the app: choose the video, mark the playing area, automatic AI analysis, manual correction in the editor, export. Each step SHALL have a short title, one or two sentences and a real screenshot or recording of that step.

#### Scenario: Walkthrough steps
- **WHEN** a visitor reads the "come funziona" section
- **THEN** it shows the five steps in the order video, area di gioco, analisi, correzione, export, each with its own app media

### Requirement: The privacy section states that videos never leave the device
The privacy section SHALL state that the analysis runs entirely on the user's device and that no video is uploaded to any server. It SHALL NOT claim certifications or guarantees beyond that.

#### Scenario: Privacy claim
- **WHEN** a visitor reads the privacy section
- **THEN** it says that the AI runs on the device and that videos are not uploaded

### Requirement: The pricing section states there is no subscription
The no-subscription section SHALL state that Danamus has no subscription and no additional costs for analysis or export. It SHALL NOT show prices.

#### Scenario: No subscription message
- **WHEN** a visitor reads the no-subscription section
- **THEN** it says there is no subscription and no extra cost, and shows no price

### Requirement: The platforms section shows Windows, macOS and iOS
The platforms section SHALL show the app on Windows, macOS and iOS together, each with its name and a real screenshot in a frame matching the platform (desktop window or iPhone).

#### Scenario: Three platforms shown
- **WHEN** a visitor reaches the platforms section
- **THEN** Windows, macOS and iOS are each named and each shows a screenshot of the app

### Requirement: Calls to action read their targets from one configuration
The hero and final calls to action SHALL take their link targets and labels from a single site configuration. A platform without a configured link SHALL show a non-clickable "In arrivo" state instead of a broken link.

#### Scenario: No download link configured
- **WHEN** the configuration has no link for iOS
- **THEN** the iOS call to action reads "In arrivo" and is not a link

#### Scenario: Link configured
- **WHEN** the configuration sets a download link for macOS
- **THEN** the macOS call to action links to that URL

### Requirement: The page has sharing and search metadata
The page SHALL provide a title, a meta description, Open Graph and Twitter card tags with a preview image, a canonical URL, and the Danamus favicon set and web manifest.

#### Scenario: Link shared in a chat
- **WHEN** the site URL is pasted in a messaging app that reads Open Graph
- **THEN** the preview shows the Danamus title, description and preview image
