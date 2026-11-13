# Elsewhere
Work from somewhere new.

A runnable, mobile-first Dubai discovery MVP built with Astro 5, TypeScript, Tailwind 4, self-hosted Geist and Phosphor icons (inlined at build time). Includes Discover, Explore, Place details and Saved. No accounts, keys, backend, geolocation or paid services required.

**Demo content only:** all eight venue names, policies, prices, work modes and evidence records are fictional scenarios. Photographs are illustrative stock images, not venue photos. The dates demonstrate verification aging; they do not certify anything. Directions intentionally open neighbourhoods, clearly labelled in the UI.

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
Search by name, neighbourhood, type and summary; combined filters with an active-filter count on smaller screens; work-mode links; shareable Explore URLs and browser Back; per-amenity provenance and freshness shown as evidence pills (only a current verified yes is styled positive) on cards, details and a Saved comparison table; details; Google Maps directions; saves with reload persistence, cross-tab updates and blocked-storage feedback; empty states; a Submit a place page that explains requirements without pretending to send anything; 404; keyboard navigation; icon hover micro-animations that switch off under reduced motion.

## Before publishing
This is an implementation starter, not a live verified directory. Keep demo labels and `noindex` until real venue data and photo rights are approved. The user reported elsewhere.work available; registration, ownership and trademark clearance have not been established. Review brand clearance before launch. No domain purchase or deployment is included.
