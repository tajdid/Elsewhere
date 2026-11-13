# Implementation, Codex and local operations
## Stack and architecture
Astro 5 static output; strict TypeScript; Tailwind 4 Vite plugin; custom CSS semantic tokens; locally packaged Geist variable font. Astro renders data to HTML and builds all detail routes. A single bundled TypeScript entry handles filtering, URL state, browser storage and evidence freshness. No API keys, runtime database or server adapter.

Astro 5 is a stable starter baseline deliberately pinned by package-lock.json. Future major upgrades are separate work; don't replace dependencies with `latest` during routine installs. Tailwind uses `@import "tailwindcss"` and `@theme` in CSS, not a legacy Tailwind 3 config. See official Astro styling docs in SOURCES.md.

## Source tree
```
elsewhere-starter/
  AGENTS.md
  README.md
  package.json / package-lock.json
  astro.config.mjs / tsconfig.json
  playwright.config.ts
  .taste-skill/direction.json
  docs/
    01-PRD.md
    02-DESIGN-SYSTEM.md
    03-IA-PAGES-COMPONENTS.md
    04-DATA-VERIFICATION.md
    05-ACCEPTANCE-QA.md
    06-IMPLEMENTATION-CODEX.md
    07-VALIDATION.md
    SOURCES.md / tokens.json
  public/
    favicon.svg
    images/scene-{1..8}.jpg
  src/
    components/Listing.astro / PlaceCard.astro / SaveButton.astro / EvidencePill.astro / Icon.astro
    data/places.json
    layouts/Layout.astro
    lib/schema.ts / places.ts / discovery.ts / icons.ts (build-time Phosphor reader) / ui.ts (icon mappings) / details.ts (speed tiers, access labels, usual hours) / dates.ts (Dubai-time dates) / submissions.ts (report validation and storage)
    pages/index.astro / explore.astro / saved.astro / about.astro / submit.astro / 404.astro
    pages/places/[slug].astro
    scripts/app.ts (search, filters, saves) / submit.ts (report form) / carousel.ts (Discover featured places)
    styles/global.css
  tests/discovery.test.ts / app.spec.ts
```

## Data flow
JSON → runtime Zod validation at build/import → HTML pages and compact browser bundle. Search/filter reads the same validated array and hides unmatched SSR cards. Count and empty state derive from matches, not handwritten totals. `evidenceState()` and `evidenceTone()` supply evidence labels, pill tones and the positive filter rule (`verifiedYes()`), so the display and the filter can never disagree; the current browser time recalculates staleness at visit. Static no-JS snapshots are only as fresh as their build, so plan daily rebuilds for a real directory.

Client storage key `elsewhere:saved:v1` stores versioned IDs only. Reads validate shape, known IDs and duplicates. Writes are guarded; blocked persistence falls back to current-page memory with explicit user feedback. There is no HTTP cookie or server state to sync.

## Taste Skill installation and use with Codex
Official Taste documentation was checked on 3 November 2026; default core install is described there as v2 experimental. The locally available skill in this session has a direction-draw/app-review workflow that may differ from the current upstream package. Follow the SKILL.md actually installed; record its version/commit if reproducibility matters.

From the project root, install only the core skill for Codex:
```sh
npx skills add https://github.com/Leonxlnx/taste-skill --skill design-taste-frontend -a codex
```
This combines the documented core skill selector and Codex agent selector. Review the install destination shown by the installer; choose the project scope for team portability. The official full-bundle Codex command is `npx skills add Leonxlnx/taste-skill -a codex`; the full bundle is optional, not required for this starter.

Open the folder in Codex. Confirm the skill is listed in that session's available skills; if not, start a new session after installation and inspect the installer's output. Ask Codex explicitly to use `design-taste-frontend`. Skills are instruction folders with a SKILL.md, not an npm runtime dependency of the website. Do not add the skill repo to application imports or deploy it as client code.

Suggested next prompt:
> Read AGENTS.md and docs/01-PRD.md through docs/07-VALIDATION.md. Use design-taste-frontend and preserve the explicit Elsewhere tokens, Geist typography and scope. Review the live Discover, Explore, Place details and Saved screens at 390, 768 and 1440px, plus 320px overflow. Improve clarity and accessibility using the existing Astro/TypeScript/Tailwind structure. Do not invent venue evidence, remove demo labels, add auth or publish. Run npm test, npm run build and relevant browser tests; report actual results and remaining issues.

### Using it with Claude Code
Run the same core installer and pick Claude Code as the agent (do not reuse the `-a codex` selector), choosing project or user scope. Claude Code lists installed skills at session start; invoke it with `/design-taste-frontend` or ask Claude to use `design-taste-frontend`, which reads `SKILL.md` first. For these screens use its app-screen mode (`references/app-screens.md`, `inspect.mjs --app`). The inspector needs Chrome, Edge or Chromium; with only Playwright installed, set `CHROME_PATH` to Playwright’s Chromium binary (under `~/Library/Caches/ms-playwright/` on macOS). Inspector output goes to `.taste-skill/before|after/`, which is git-ignored apart from `direction.json`.

Do not blindly apply skill defaults that conflict with the brief: this MVP has the requested light palette, photography, forest action and larger editorial Discover title. It does not need a dark theme, scroll animation or extra typeface just because a generic skill suggests one.

## Run and verify
See README for `npm ci`, `npm run dev`, `npm test`, `npm run build`, `npm run preview` and Playwright setup. Node/npm must be installed separately. No environment file is required. If npm cannot reach registry.npmjs.org, resolve network access rather than changing the lockfile to untrusted mirrors. A stock source ZIP intentionally does not contain node_modules.

## Implementation milestones
1. Starter review: run locally and test all four journeys; agree copy, modes and evidence presentation.
2. Content pilot: research a small initial set of actual venues with source-backed fields, mode rationales and approved media. Keep them private until review.
3. Production data: extend schema for structured sources, prices, mode provenance and media rights; validate before build. Preserve old slugs with redirects if changed.
4. QA: perform manual assistive-technology, Safari/iOS, Chrome/Android and performance checks, approve brand and data.
5. Release: deploy `dist/` to a static host after explicit request. Configure HTTPS, clean URL paths and the custom 404. Check domain ownership, DNS and canonical URLs. Add sitemap and canonical tags for actual approved content; remove noindex only when ready. Do not submit fabricated LocalBusiness structured data.

## Deployment and maintenance contract
Build command `npm ci && npm run build`; publish directory `dist`; no server adapter. A future CI can run unit tests/build and scheduled rebuilds; none is silently configured here. Host should serve existing routes before 404 and set standard security headers, including X-Content-Type-Options and Referrer-Policy. Add a tested CSP compatible with Astro's generated assets if required; don't paste an untested policy that blocks scripts/fonts.

No deployment, domain registration, trademark clearance or real venue verification is included. elsewhere.work availability is user-reported only. Assign an editorial owner and recheck schedule before operating the directory.
