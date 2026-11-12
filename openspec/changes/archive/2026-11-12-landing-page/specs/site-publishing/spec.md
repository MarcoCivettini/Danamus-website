# Spec Delta

## Purpose

Defines how the website is built and published: a static build with no runtime backend, automatic deployment to GitHub Pages from the main branch, and a private preview for review before anything is public.

## ADDED Requirements

### Requirement: The site builds to static files
The site SHALL build into a folder of static files (HTML, CSS, JavaScript, media) that can be served by any static host, with no server-side code at runtime and no runtime requests to third-party CDNs.

#### Scenario: Serving the build
- **WHEN** the build folder is served by a plain static file server
- **THEN** every page, style, script, font and media item loads from that folder

### Requirement: The site works under a sub-path
The build SHALL work both at a domain root and under a repository sub-path such as `/Danamus-website/`, with the base path set in one configuration value.

#### Scenario: GitHub Pages project URL
- **WHEN** the site is served at `https://<owner>.github.io/Danamus-website/`
- **THEN** all links, styles, fonts and media resolve without 404 errors

### Requirement: Main is deployed to GitHub Pages automatically
A push to the `main` branch SHALL build the site and deploy it to GitHub Pages through GitHub Actions. A failed build SHALL NOT replace the deployed site.

#### Scenario: Push to main
- **WHEN** a commit is pushed to `main` and the build succeeds
- **THEN** the new build is published on GitHub Pages

#### Scenario: Broken build
- **WHEN** a commit is pushed to `main` and the build fails
- **THEN** the previously deployed site stays online

### Requirement: A private preview is available before going public
Each implementation round SHALL produce a private preview of the built site that the user can open without the repository being public.

#### Scenario: Review before publishing
- **WHEN** the implementation of the landing page is complete
- **THEN** the user receives a private link to a preview of the built site

### Requirement: The page meets performance targets
On a mid-range phone profile, the landing page SHALL reach Largest Contentful Paint under 2.5 s, Cumulative Layout Shift under 0.1, and a Lighthouse performance score of at least 90.

#### Scenario: Lighthouse mobile run
- **WHEN** Lighthouse runs on the built page with its default mobile profile
- **THEN** performance is at least 90, LCP is under 2.5 s and CLS under 0.1
