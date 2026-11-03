# Validation and delivery report
3 November 2026 · Run by Claude Code (Opus 5.5) on macOS (Darwin 25.6), Node 26.5.0, npm 11.17.0, Astro 5 (locked), Playwright Chromium (build 1248). Every result below was produced in this session; earlier reports are superseded.

## Baseline before changes
`npm ci`, then `npm test` 8/8, `astro check` 0 errors / 0 warnings / 0 hints, `npm run build` 13 pages, `npm run test:e2e` 8/8. Production screenshots of all four screens at 390/768/1440 were reviewed before any edit.

## What changed and why
1. **Evidence states were visually identical.** Every card's Wi-Fi line used the same forest text, so "No · Verified", "Not checked" and "Conflicting reports" looked as affirmative as "Yes · Verified". Added `evidenceTone()` and an `EvidencePill` component: only a current verified yes uses the lime signal; verified no, caution (reported / conflicting / needs recheck) and unknown each have their own tone and glyph, and the words still carry the meaning. Tone is re-evaluated at visit time, like the label.
2. **Cards hid the power evidence** although "Verified power" is a filter. Cards now show Wi-Fi and power pills on two aligned rows.
3. **Invalid `?mode=` in a URL unchecked every work-mode radio** (the spec requires a fallback to Any). Fixed; unknown select values also fall back to All. Covered by a new browser test.
4. **Closed filter disclosure hid active filters** on phones and tablets. The Filters button now reads "Filters · N active".
5. **Work-mode radios wrapped onto two ragged rows on phones.** They are now native radios shown as one row of 44px chips that scrolls inside itself; the page never scrolls sideways.
6. **Details placed every content block below the first desktop screen.** The photo and a sticky "Plan a visit" panel (spend, area, hours, directions) now share the first screen; evidence follows the photo. Below 768px the order is photo, visit, evidence.
7. **Saved gave no way to decide between saved places.** Added a "Compare evidence" table (place × five amenities, same pills), hidden when nothing is saved.
8. **About** now has a legend that uses the real pills for every evidence state.
9. Typing in the search field and leaving it no longer pushes history (the spec says typing updates only on submit), and identical URLs are not pushed twice.

## Executed checks (final state)
- `npm test`: **9/9 pass** (new: evidence tone is positive only for a current verified yes; stale, future, reported, conflicting, verified-no and unknown are not).
- `npm run build`: `astro check` **0 errors, 0 warnings, 0 hints**; 13 static pages including all eight detail slugs.
- `npm run test:e2e` against the dev server: **10/10 pass** (new: invalid URL fallback plus "N active" count; per-amenity pills on cards plus Saved comparison rows, and the table hides after the last removal). The first run after editing the test file failed once at `page.goto` while the dev server recompiled; three immediate full reruns and the final runs passed. Recorded here instead of being dropped.
- The same 10 browser tests against the **static production preview** (`astro preview` on 4321): **10/10 pass**.
- Production preview, scripted: horizontal overflow is **0px** on Discover, Explore, filtered Explore, details, Saved and About at 320px, at 640 CSS px with DPR 2 (200% zoom of a 1280px window), and at 320 CSS px with DPR 2. With `prefers-reduced-motion: reduce`, **0** elements have a transition or animation (35 have short colour transitions otherwise). Geist Variable loads; 0 broken images after scrolling; the result count matches visible cards; **0 console or page errors** (`docs/previews/browser-errors.json`).
- Taste Skill (`design-taste-frontend`, local copy, app-screen mode): `lint.mjs src` **0 FAIL, 0 WARN**. `inspect.mjs --app` on the production preview at 1440/768/390: **0 FAIL** on all four screens. Before: 0 FAIL with 2, 2, 3, 3 WARN. After: 2, 3, 3, 3 WARN. Warnings kept on purpose:
  - `palette-cream` (all screens): #F7F6F2 is the required brand paper.
  - `app-title-size`: the Discover tagline is the editorial greeting; Explore and Saved titles were reduced from 52px to 40px and the detail name from 52px to 48px. Further reduction would break the requested Mobbin-like editorial hierarchy.
  - `edge-text` on Explore at 390px: the last work-mode chip is cut at the edge of its own scrolling row on purpose, so the row reads as scrollable.
  - `below-fold` on details: improved from 0 to 1 of 7 blocks (the photo and visit panel share the block); the evidence heading starts just below a 900px-tall window.
  - `hero-void` on Saved: the inspector opens a fresh browser with no saves, so it measures the empty state beside the title. With saves, the comparison table fills the page width (see `saved-1440.png`).
- Bundle (production): client JS 71.9KB raw / **16.0KB gzip**; CSS 22.7KB raw / **6.1KB gzip**. Both are inside the 60KB / 25KB budgets. Photos are unchanged at about 125, 109, 154 and 237KiB; scene 4 is still over the 200KB goal for lower photos.

## Screenshot review
Captured from the production build at 390, 768 and 1440px into `docs/previews/`. Saved is seeded with demo-01 and demo-03; Explore is unfiltered. Each image was opened and reviewed after the last change. Findings fixed during review: the work-mode legend touched the Search buttons; card pills wrapped unevenly at 768px. Remaining visible tradeoffs: the eight fictional venues reuse four illustrative photos; at 1440px, two saved cards leave the right half of the card row empty, with the comparison table below at full width.

## Not performed here
No VoiceOver or NVDA pass; no Safari/iOS, Firefox or Chrome/Android runs (Chromium only); no Lighthouse or field performance data; no increased-default-font-size audit beyond the zoom emulation above. The packaged ZIP, MANIFEST.sha256 checksums and fresh-extract verification described in CLAUDE.md were **intentionally skipped at the owner's request**; the source is delivered through the Git repository instead.

## Still required before public launch
Manual screen-reader evaluation, cross-browser and device checks, lab and field performance; an independently sourced real venue inventory with per-amenity evidence; access review; licensed venue photography and media-rights review; domain ownership and trademark clearance; production host, DNS, HTTPS and 404 checks; removal of `noindex` only after all of these. Domain availability remains user-reported. No purchase, deployment, venue outreach, payment integration or trademark work was done.
