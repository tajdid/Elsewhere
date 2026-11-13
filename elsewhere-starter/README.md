# Elsewhere
Work from somewhere new.

A runnable, mobile-first Dubai discovery MVP built with Astro 5, TypeScript, Tailwind 4, self-hosted Geist and Phosphor icons (inlined at build time). Includes Discover, Explore, Place details and Saved. No accounts, keys, backend, geolocation or paid services required.

**Data:** Places come from the owner’s Notion list “WFH in Dubai” (imported 13 Nov 2026; 53 real venues, isSample=false). Every fact is copied from that list and dated by when the entry was added (2020–2023): status is Reported, never Verified, until someone re-checks it. Missing facts stay null/unknown and the UI shows “not added” placeholders; never fill them from general knowledge about similarly named businesses. Areas are set only where the list names them. At the owner’s request, guest Wi-Fi passwords from the list are shown with a Copy button, labelled with when they were listed. At the owner’s request (13 Nov 2026) places show temporary stock photos, chosen by type from public/images, until real photos exist. Their alt text and credit say they are not the venue, and the place page captions each one “Temporary photo, not this place”. Replace them with licensed photos of each venue before launch. Directions use the owner’s Google Maps link when present, otherwise a labelled Google Maps search by name. noindex stays until the owner decides to launch.

## Run locally
Install Node.js 22.12+ (Node 22 LTS recommended) and npm. Unzip, open this folder in a terminal, then:

```sh
npm ci
npm run dev
```

Open http://localhost:4321. To check and build:

```sh
npm test
npm run build
npm run preview
```

Preview serves the static build at http://localhost:4321. Internet is required for dependency installation only; images and fonts are bundled. If port 4321 is in use, Astro reports an alternate port. Use `npm run dev -- --host 0.0.0.0` to test from a phone on the same trusted network. Local storage belongs to the browser and origin, so a different hostname or port has a separate shortlist.

Optional browser tests:

```sh
npx playwright install chromium
npm run test:e2e
```

By default the tests start (or reuse) a dev server on port 4321. To test the production build instead, run `npm run build && npx astro preview --port 4330` and then `E2E_BASE_URL=http://localhost:4330 npm run test:e2e`.

On Linux, Playwright may request OS dependencies via `npx playwright install --with-deps chromium`.

## Start reading
- [Product requirements](docs/01-PRD.md): scope, journeys, priorities, measures and launch gates.
- [Design system](docs/02-DESIGN-SYSTEM.md): tokens, type, responsive composition and accessibility.
- [IA, pages and components](docs/03-IA-PAGES-COMPONENTS.md): implementation contracts and interaction states.
- [Data and verification](docs/04-DATA-VERIFICATION.md): schema, evidence policy and editorial workflow.
- [Acceptance criteria](docs/05-ACCEPTANCE-QA.md): executable and manual scenarios.
- [Implementation and Codex](docs/06-IMPLEMENTATION-CODEX.md): architecture, Taste setup, milestones and deployment.
- [Validation report](docs/07-VALIDATION.md): actual checks and remaining launch work.
- [Sources](docs/SOURCES.md): primary documentation and image provenance.
- [AGENTS.md](AGENTS.md): instructions for the next Codex session.

The design token source is `src/styles/global.css`; portable values are in `docs/tokens.json`. Data is `src/data/places.json`, validated by `src/lib/schema.ts`. The source tree and route map are in the implementation guide. A lockfile pins installed versions; the chosen Astro 5 baseline is deliberate, not a claim to be the newest major.

## What works
Search by name, neighbourhood, type and summary; combined filters with an active-filter count on smaller screens; work-mode links; shareable Explore URLs and browser Back; per-amenity provenance and freshness shown as evidence pills (only a current verified yes is styled positive) on cards, details and a Saved comparison table; details; Google Maps directions; saves with reload persistence, cross-tab updates and blocked-storage feedback; empty states; Submit a place and “Report what you found” on each place (a validated form; see Submissions below); 404; keyboard navigation; icon hover micro-animations that switch off under reduced motion.

## Submissions
`/submit/` adds a new place; `/submit/?place=<slug>` reports on a listed one (linked from each place page as “Report what you found”). The form validates name, neighbourhood and a visit date that is not in the future (Dubai time), and captures yes / no / not sure for all five amenities plus notes.

- Set `PUBLIC_SUBMIT_ENDPOINT` at build time (for example `PUBLIC_SUBMIT_ENDPOINT=https://api.example.com/reports npm run build`) to POST each report as JSON (`version`, `kind`, `placeId`, `name`, `category`, `neighbourhood`, `visitedOn`, `amenities`, `notes`, `submittedAt`). Any non-2xx response or network failure keeps the form filled and shows a retry message.
- Without it, reports are kept in this browser's local storage (`elsewhere:submissions:v1`, newest 50) and the confirmation says “saved in this browser… hasn't been sent anywhere yet”. The UI never claims a report was received unless the endpoint accepted it.
- No backend, moderation queue or spam protection is included; add those with the endpoint. Reports never change evidence on the site automatically: they are Reported until an editor verifies them.

## Before publishing
This is an implementation starter, not a live verified directory. The UI shows no demo labels, so keep `noindex` and do not deploy publicly until real venue data and photo rights are approved. The user reported elsewhere.work available; registration, ownership and trademark clearance have not been established. Review brand clearance before launch. No domain purchase or deployment is included.
