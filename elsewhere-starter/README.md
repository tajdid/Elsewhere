# Elsewhere
Work from somewhere new.

A runnable, mobile-first Dubai discovery MVP built with Astro 5, TypeScript, Tailwind 4, self-hosted Geist and Phosphor icons (inlined at build time). Includes Discover, Explore, Place details and Saved. No accounts, keys, backend, geolocation or paid services required.

**Data:** Places come from the owner’s Notion list “WFH in Dubai” (imported 13 Nov 2026; 53 real venues, isSample=false). Fifteen more came through the Submit a place Sheet once the owner published them (68 in all). Four are visitor reports, added 26–27 Nov 2026 (Café De Paris, Counter Culture Café, Splendour Fields, Single Fin Cafe): their answers are Reported with source “Visitor report”, dated to the report. Eleven were entered by the owner on 27 Nov 2026 from a community recommendation and an Instagram find: their answers are Reported with source “Community recommendation” (or “Instagram”), dated 27 Nov 2026, and their street locations are kept as location notes, not validated addresses. Unanswered questions stay unknown. Every fact is copied from that list and dated by when the entry was added (2020–2023): status is Reported, never Verified, until someone re-checks it. Missing facts stay null/unknown and the UI shows “not added” placeholders; never fill them from general knowledge about similarly named businesses. Areas are set only where the list names them. At the owner’s request, guest Wi-Fi passwords from the list are shown with a Copy button, labelled with when they were listed. At the owner’s request (13 Nov 2026) places show temporary stock photos, chosen by type from public/images, until real photos exist. Their alt text and credit say they are not the venue, and the place page captions each one “Temporary photo, not this place”. Replace them with licensed photos of each venue before launch. Directions use the owner’s Google Maps link when present, otherwise a labelled Google Maps search by name. The owner launched on 19 Nov 2026: Vercel Production builds are indexable (switch off with PUBLIC_ALLOW_INDEXING=false); previews and local builds stay noindex.

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
`/submit/` adds a new place; `/submit/?place=<slug>` reports on a listed one (linked from each place page as “Report what you found”). The form is one page of rows grouped into five sections (The place, Wi-Fi, Working there, Getting there, Your visit): each question has its label on the left and answer chips or a field on the right (stacked on phones), and the map preview appears under the place name once a place is picked. Nothing is pre-selected: an unanswered question counts as “Not sure”. Two answers are derived rather than asked: the socket count answers “Could you plug in?” (None = no, any number = yes) and the noise level answers whether calls are okay (quiet or moderate = yes, loud = no), so the Sheet's `Power sockets` and `Calls` columns follow those answers. Sockets offers None, A few, Some and Plenty, written to the Sheet as 0 (blank), 1, 2 and 4 on the list's 1–5 scale (`derivedAmenities` in `src/lib/submissions.ts`). The form validates name, neighbourhood and a visit date that is not in the future (Dubai time), and captures yes / no / not sure for all five amenities plus notes. Optional questions cover sockets, noise, entry, pets (inside, outdoor seating only, or not allowed) and parking (street, car park, valet or none; “Is parking free?” appears only when there is parking). Parking records the kind and whether it's free, never a price.

The form also has an optional contact email (“only used if we have a question about your report”) and, when “Password from staff” is chosen, an optional Wi-Fi password field. The password is saved in the Sheet's last column (only for that choice), is never kept in the browser, and reaches the site only if you add it through the import.

**Where reports go.** On Vercel the form sends each report to `api/submit.ts` (`PUBLIC_SUBMIT_ENDPOINT` defaults to `/api/submit` there), a Vercel function next to the static site (no Astro adapter; every page is still prerendered). It appends one row to a Google Sheet with a new submission ID, the time received and the status **Pending**, and answers 201 only after Google confirms the row. Nothing is published automatically: review the Sheet and add approved places through the usual import.

- **Checks on the server:** same-origin requests only; JSON up to 10 KB; the same field rules as the form (see `api/_lib/payload.ts`, kept in step with `src/lib/submissions.ts` by `tests/submit-api.test.ts`); a hidden trap field (filled means a quiet 200 and no row); a form sent less than 2 seconds after opening is refused; at most 5 reports per address per 10 minutes per running instance (best effort). Values are written with `valueInputOption=RAW`, so text like `=HYPERLINK(…)` is stored as text. Errors are logged by cause only, never with form data.
- **In the browser:** if sending fails for any reason, the report is saved on the device (“Your reports” shows “Saved on this device”), the form stays filled and says so; a successful retry replaces that copy. The local copy never includes the email.
- **Without the endpoint** (for example `astro dev`), reports are only kept in this browser's local storage (`elsewhere:submissions:v1`, newest 50) and the confirmation says they haven't been sent.

**Google Sheets setup (owner; keys never go in the repo):**
1. Create a Google Sheet with a tab named `Submissions` and this header row:
   `Submission ID | Received at | Review status | Kind | Place ID | Name | Type | Neighbourhood | Visited on | Wi-Fi | Power sockets | Laptop policy | Calls | Step-free | Wi-Fi Mbps | Wi-Fi access | Notes | Contact email | Submitted at (browser) | Form version | Wi-Fi password | Google place ID | Address (Google) | Latitude | Longitude | Sockets (1-5) | Noise | Entry | Website | Hours | Parking | Parking cost | Pets | Raw submission (JSON)`
   **Existing Sheet (added Nov 2026):** insert three columns headed `Parking`, `Parking cost` and `Pets` just before `Raw submission (JSON)`, before deploying this version, so new rows line up with the headers.
2. In Google Cloud Console create a project and enable the **Google Sheets API**.
3. Create a **service account** (no roles needed), then add a **JSON key** and download it.
4. Share the Sheet with the service account's email as **Editor**.
5. In Vercel → Settings → Environment Variables (Production and Preview; mark them Sensitive): `GOOGLE_SHEETS_ID` or `GOOGLE_SHEET_ID` (from the Sheet URL), `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` (the `private_key` value from the JSON, pasted as is) (`PUBLIC_SUBMIT_ENDPOINT` defaults to `/api/submit` on Vercel). Optional: `GOOGLE_SHEETS_TAB` if the tab isn't called `Submissions`.
6. Redeploy, then delete the downloaded JSON file.

A Google Workspace organisation may block service-account keys; a personal Google account does not.

## Place search and maps (Google)
**Submit a place:** the Place name box suggests places as you type (Google Places, through `api/places.ts`, so the key stays on the server; UAE only, biased to Dubai). Picking one fills the name, keeps Google's place ID, address and coordinates, suggests the neighbourhood (Google's “Jumeirah Lake Towers” becomes the list's “JLT”), and eases a small Google map to the spot: a pan, then a zoom from 11 to 16 over about a second, or an instant jump with reduced motion. “Not this place” clears it. Typing a name without picking still works, and without the keys the box is a plain text field as before. The Sheet gets four more columns at the end: `Google place ID | Address (Google) | Latitude | Longitude`.

**Existing listings:** a place with a confirmed Google place ID gets exact Directions (Google Maps link to that place) and a small map in “Plan a visit” (Maps Embed API). The owner's own Maps link still wins where there is one. IDs are kept in `src/data/google-places.json`, separate from the Notion import, and only after the owner confirms them:
1. `npx tsx --env-file=.env.local scripts/match-places.ts` proposes a match for each place and writes `scripts/place-matches.csv` (not committed).
2. Open it, check each row (list name and area against Google's name and address) and put `yes` in `confirm` for the right ones.
3. `npx tsx scripts/apply-place-matches.ts` saves only the `yes` rows.

**Opening hours:** Google's terms don't allow storing its hours, so they are never saved. Place pages with a confirmed place ID and no hours of our own show “Show hours from Google” in Plan a visit; a tap fetches the usual weekly hours live (`/api/places`, `action: hours`, only for confirmed place IDs, `no-store`) and labels them “From Google Maps, just now. Holiday hours can differ.” No “open now” claim. Hours are a higher Google pricing tier with a smaller free allowance, which is why they load only on a tap. Hours the owner records with a source and date (`hours` in the data) take priority.

**Keys (owner):** in Google Cloud, on the billing account, enable **Places API (New)**, **Maps JavaScript API** and **Maps Embed API**, then create two API keys:
- **Server key** → Vercel `GOOGLE_PLACES_API_KEY` (and `.env.local` for the matching script). Restrict it to *Places API (New)*.
- **Browser key** → Vercel `PUBLIC_GOOGLE_MAPS_BROWSER_KEY`. Restrict it to *Maps JavaScript API* and *Maps Embed API*, and to the site's addresses (`elsewhere-work.vercel.app/*`, and any custom domain). It is visible in the page by design.
- Optional `PUBLIC_GOOGLE_MAPS_MAP_ID`: a Map ID from Google Maps Platform (needed for the map marker; `DEMO_MAP_ID` is used until then).
- Set daily quotas (e.g. Places autocomplete 300/day) and a budget alert so usage stays inside the free monthly allowance.

Google's terms: place IDs may be kept indefinitely; addresses and coordinates from Google are for limited caching, so the site stores only the place ID and lets Google show the address and map. The Sheet's address and coordinates are for reviewing a submission, not for publishing as-is.

## Search settings
- `PUBLIC_SITE_URL`: canonical base URL (defaults to the Vercel production domain, else `https://elsewhere-work.vercel.app`).
- Indexing: Vercel Production builds are indexable by default since launch (19 Nov 2026). `PUBLIC_ALLOW_INDEXING=false` switches it off; `=true` turns it on for a local build. Previews never index.
- After launch: verify the domain in Google Search Console and Bing Webmaster Tools, submit `/sitemap.xml`, and run Google’s Rich Results Test on a place page.

## Before publishing
This is an implementation starter, not a live verified directory. The UI shows no demo labels, so keep `noindex` and do not deploy publicly until real venue data and photo rights are approved. The user reported elsewhere.work available; registration, ownership and trademark clearance have not been established. Review brand clearance before launch. No domain purchase or deployment is included.
