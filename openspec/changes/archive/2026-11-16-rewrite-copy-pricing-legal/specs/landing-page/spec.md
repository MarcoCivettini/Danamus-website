# Spec Delta

## MODIFIED Requirements

### Requirement: The page presents the product in a fixed sequence of sections
The landing page SHALL show, in this order: navigation bar, hero, problem section, "come funziona" walkthrough, audience section, on-device privacy section, phone-and-computer section, pricing teaser, final call to action, footer.

#### Scenario: Visitor scrolls the whole page
- **WHEN** a visitor opens the site root and scrolls to the bottom
- **THEN** the sections appear in the order navigation, hero, problem, come funziona, audience, privacy, phone and computer, pricing teaser, final call to action, footer

### Requirement: The hero states what Danamus does
The hero SHALL show a headline saying that Danamus lets the visitor rewatch only the play of a table-tennis match, a subhead naming the use case (a phone on a tripod records the match and Danamus removes the pauses automatically), a short line saying it works on phone and computer, the primary call to action, and a real capture of the app inside a device frame.

#### Scenario: First screen on desktop
- **WHEN** the page is opened in a 1440x900 viewport
- **THEN** the headline, the subhead, the primary call to action and the app capture are visible without scrolling

#### Scenario: First screen on a phone
- **WHEN** the page is opened in a 390x844 viewport
- **THEN** the headline and the primary call to action are visible without scrolling

### Requirement: The walkthrough follows the app's real flow
The "come funziona" section SHALL present five steps in the order of the app: choose the video, mark the playing area, automatic AI analysis, manual refinement in the editor, export. Each step SHALL have a short title, one or two sentences and a real screenshot or recording of that step. The section SHALL say that Danamus does most of the work automatically and that the editor is built for table tennis, so the result can be refined by hand.

#### Scenario: Walkthrough steps
- **WHEN** a visitor reads the "come funziona" section
- **THEN** it shows the five steps in the order video, area di gioco, analisi, rifinitura, export, each with its own app media

#### Scenario: Automatic work and manual refinement
- **WHEN** a visitor reads the analysis and editor steps
- **THEN** they say that the analysis finds the rallies on its own and that the editor lets the visitor adjust each rally by hand

### Requirement: The privacy section states that videos never leave the device
The privacy section SHALL state that the analysis runs entirely on the user's device and that the video leaves the device only when the user chooses to share or export it elsewhere. It SHALL NOT claim certifications or guarantees beyond that, and SHALL NOT show the app's analysis log.

#### Scenario: Privacy claim
- **WHEN** a visitor reads the privacy section
- **THEN** it says that the AI runs on the device and that the video is not sent anywhere unless the user shares it

#### Scenario: No analysis log
- **WHEN** a visitor looks at the privacy section
- **THEN** no capture of the analysis log is shown

### Requirement: The platforms section shows Windows, macOS and iOS
The phone-and-computer section SHALL state that Danamus works on both a phone and a computer, and name the supported systems (Windows, macOS, iOS). It SHALL show at least one real capture of the app, and SHALL NOT need a separate capture for every system.

#### Scenario: Three platforms shown
- **WHEN** a visitor reads the phone-and-computer section
- **THEN** it says the app works on phone and computer, names Windows, macOS and iOS, and shows at least one real capture

### Requirement: The page has sharing and search metadata
Every page SHALL provide its own title, meta description and canonical URL, Open Graph and Twitter card tags with a preview image, and the Danamus favicon set and web manifest. The title and description SHALL NOT mention subscriptions.

#### Scenario: Link shared in a chat
- **WHEN** the site URL is pasted in a messaging app that reads Open Graph
- **THEN** the preview shows the Danamus title, description and preview image

#### Scenario: Sub-page metadata
- **WHEN** the pricing or privacy page is loaded
- **THEN** its title, description and canonical URL describe that page, not the landing page

## ADDED Requirements

### Requirement: The problem section states the dead time with numbers
The problem section SHALL state that in a typical match about 20 minutes of video hold about 5 minutes of actual play, and that cutting a video by hand takes about an hour. It MAY add that a rally lasts 3–4 seconds on average. Numbers from the author's experience SHALL be worded as typical or approximate, not as measured results.

#### Scenario: Numbers shown
- **WHEN** a visitor reads the problem section
- **THEN** it shows about 20 minutes of video, about 5 minutes of play and about one hour of manual editing, worded as approximate

### Requirement: The problem section explains why replays matter
The problem section SHALL say that rewatching one's own matches helps a player improve, and that what is worth rewatching is the play, not the pauses between rallies.

#### Scenario: Reason to rewatch
- **WHEN** a visitor reads the problem section
- **THEN** it links improving to watching replays and says the pauses are what makes full replays not worth watching

### Requirement: The audience section names who Danamus is for
The audience section SHALL name three groups: creators who promote table tennis, players who record themselves to improve, and people who want to rewatch the play or share it with friends. It SHALL describe the basic use: a phone on a tripod, record, then watch or share only the play.

#### Scenario: Three audiences
- **WHEN** a visitor reads the audience section
- **THEN** it names creators, players who want to improve, and people who want to rewatch or share, and mentions recording with a phone on a tripod

### Requirement: The page warns that analysis time depends on the device
The page SHALL state, near the analysis step, that how long the analysis takes depends a lot on the device. It SHALL NOT promise a specific analysis duration.

#### Scenario: Analysis time note
- **WHEN** a visitor reads the analysis step
- **THEN** a short note says that analysis time depends on the device, and no fixed duration is promised

### Requirement: Price is stated only as free
The landing page SHALL state the price only as "Gratis" and SHALL NOT mention subscriptions, renewals or the absence of paid plans. The pricing teaser SHALL say that analysis, editor and export of the full video are free, and SHALL link to the pricing page.

#### Scenario: Pricing teaser
- **WHEN** a visitor reads the pricing teaser
- **THEN** it says Danamus is free, lists analysis, editor and full-video export, and links to the pricing page

#### Scenario: No subscription wording
- **WHEN** the landing page text is searched for "abbonament"
- **THEN** no match is found

### Requirement: Navigation and footer link the site's pages
The navigation bar SHALL link to the landing page's sections and to the pricing page, and the footer SHALL link to the pricing page, the privacy notice and the terms of service. Links to landing-page sections SHALL work from every page.

#### Scenario: Section link from a sub-page
- **WHEN** a visitor on the pricing page activates "Come funziona" in the navigation
- **THEN** the landing page opens at the "come funziona" section

#### Scenario: Footer legal links
- **WHEN** a visitor looks at the footer on any page
- **THEN** it shows links to Prezzi, Privacy and Termini

## REMOVED Requirements

### Requirement: The pricing section states there is no subscription
**Reason**: Danamus will have paid plans, so a "no subscription" message would become false. The user also does not want subscriptions mentioned at all.
**Migration**: Replaced by "Price is stated only as free" (landing page) and the new `pricing-page` capability.
