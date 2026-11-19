# Elsewhere
Work from somewhere new.

A runnable, mobile-first Dubai discovery MVP built with Astro 5, TypeScript, Tailwind 4, self-hosted Geist and Phosphor icons (inlined at build time). Includes Discover, Explore, Place details and Saved. No accounts, keys, backend, geolocation or paid services required.

**Data:** Places come from the owner’s Notion list “WFH in Dubai” (imported 13 Nov 2026; 53 real venues, isSample=false). Every fact is copied from that list and dated by when the entry was added (2020–2023): status is Reported, never Verified, until someone re-checks it. Missing facts stay null/unknown and the UI shows “not added” placeholders; never fill them from general knowledge about similarly named businesses. Areas are set only where the list names them. At the owner’s request, guest Wi-Fi passwords from the list are shown with a Copy button, labelled with when they were listed. At the owner’s request (13 Nov 2026) places show temporary stock photos, chosen by type from public/images, until real photos exist. Their alt text and credit say they are not the venue, and the place page captions each one “Temporary photo, not this place”. Replace them with licensed photos of each venue before launch. Directions use the owner’s Google Maps link when present, otherwise a labelled Google Maps search by name. The owner launched on 19 Nov 2026: Vercel Production builds are indexable (switch off with PUBLIC_ALLOW_INDEXING=false); previews and local builds stay noindex.

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

The form also has an optional contact email (“only used if we have a question about your report”).

**Where reports go.** On Vercel the form sends each report to `api/submit.ts` (`PUBLIC_SUBMIT_ENDPOINT` defaults to `/api/submit` there), a Vercel function next to the static site (no Astro adapter; every page is still prerendered). It appends one row to a Google Sheet with a new submission ID, the time received and the status **Pending**, and answers 201 only after Google confirms the row. Nothing is published automatically: review the Sheet and add approved places through the usual import.

- **Checks on the server:** same-origin requests only; JSON up to 10 KB; the same field rules as the form (see `api/_lib/payload.ts`, kept in step with `src/lib/submissions.ts` by `tests/submit-api.test.ts`); a hidden trap field (filled means a quiet 200 and no row); a form sent less than 2 seconds after opening is refused; at most 5 reports per address per 10 minutes per running instance (best effort). Values are written with `valueInputOption=RAW`, so text like `=HYPERLINK(…)` is stored as text. Errors are logged by cause only, never with form data.
- **In the browser:** if sending fails for any reason, the report is saved on the device (“Your reports” shows “Saved on this device”), the form stays filled and says so; a successful retry replaces that copy. The local copy never includes the email.
- **Without the endpoint** (for example `astro dev`), reports are only kept in this browser's local storage (`elsewhere:submissions:v1`, newest 50) and the confirmation says they haven't been sent.

**Google Sheets setup (owner; keys never go in the repo):**
1. Create a Google Sheet with a tab named `Submissions` and this header row:
   `Submission ID | Received at | Status | Kind | Place ID | Name | Type | Neighbourhood | Visited on | Wi-Fi | Power sockets | Laptop policy | Calls | Step-free | Wi-Fi Mbps | Wi-Fi access | Notes | Contact email | Submitted at (browser) | Form version`
2. In Google Cloud Console create a project and enable the **Google Sheets API**.
3. Create a **service account** (no roles needed), then add a **JSON key** and download it.
4. Share the Sheet with the service account's email as **Editor**.
5. In Vercel → Settings → Environment Variables (Production and Preview; mark them Sensitive): `GOOGLE_SHEETS_ID` or `GOOGLE_SHEET_ID` (from the Sheet URL), `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` (the `private_key` value from the JSON, pasted as is) (`PUBLIC_SUBMIT_ENDPOINT` defaults to `/api/submit` on Vercel). Optional: `GOOGLE_SHEETS_TAB` if the tab isn't called `Submissions`.
6. Redeploy, then delete the downloaded JSON file.

A Google Workspace organisation may block service-account keys; a personal Google account does not.

## Search settings
- `PUBLIC_SITE_URL`: canonical base URL (defaults to the Vercel production domain, else `https://elsewhere-silk.vercel.app`).
- Indexing: Vercel Production builds are indexable by default since launch (19 Nov 2026). `PUBLIC_ALLOW_INDEXING=false` switches it off; `=true` turns it on for a local build. Previews never index.
- After launch: verify the domain in Google Search Console and Bing Webmaster Tools, submit `/sitemap.xml`, and run Google’s Rich Results Test on a place page.

## Before publishing
This is an implementation starter, not a live verified directory. The UI shows no demo labels, so keep `noindex` and do not deploy publicly until real venue data and photo rights are approved. The user reported elsewhere.work available; registration, ownership and trademark clearance have not been established. Review brand clearance before launch. No domain purchase or deployment is included.
