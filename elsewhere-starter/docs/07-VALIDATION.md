# Validation and delivery report
13 November 2026 · Run by Claude Code (Opus 5.5) on macOS (Darwin 25.6), Node 26.5.0, Astro 5.18.2 (locked), Playwright 1.64.1 with Chromium build 1248. Every result below was produced in this session. It supersedes the 3 November report, whose changes (evidence pills, Saved comparison, filter fixes) are kept.

## Second round (same day): Submit a place and a motion review
- **Header:** the static “Dubai” label at the top right became a “Submit a place” link to a new `/submit/` page (14 static pages now). The demo has no backend or inbox, so the page has no form. It says submissions are not open, lists what a submission needs, and explains that submissions start as Reported. A new browser test covers the link, the page and its `aria-current` state.
- **Motion review** with the `emil-design-eng` skill:
  - A stronger ease-out, `cubic-bezier(.23,1,.32,1)`.
  - Press feedback (scale 0.97) on every pressable control.
  - Hover motion gated to `(hover:hover) and (pointer:fine)`.
  - The hover keyframes (wiggle, heart pop) became interruptible transitions.
  - Photo hover went from 700ms / 1.035 to 300ms / 1.025; icon moves went from 280ms to 200ms.
  - The saved heart enters with `@starting-style` from a visible scale.
  - Reduced motion now keeps colour fades and removes only movement.
- **Measured on the production preview** (Chromium):
  - The primary button's timing function is `cubic-bezier(0.23, 1, 0.32, 1)`, and pressing it gives `matrix(0.97…)`.
  - Card photo hover gives `matrix(1.025…)`, and a new save plays `heart-pop`.
  - Under `prefers-reduced-motion: reduce`, **0** elements animate or transition transform, while 26 keep colour fades.
- **Server mix-up, recorded:** during this round a stray `astro dev` server, spawned by Playwright's webServer, held `[::1]:4321` beside the preview. Chromium resolved `localhost` to it, and one set of screenshots showed the dev toolbar. Both servers were killed, the preview was restarted alone (checked on localhost, 127.0.0.1 and [::1]), and every browser result in this section and the screenshots was re-run on it.
- **Results:**
  - `npm test` 9/9.
  - `npm run build`: 0 errors / 0 warnings / 0 hints, 14 pages.
  - `npm run test:e2e` on the preview: **12/12**.
  - Overflow is 0px at 320px and at 200% zoom on every route, including `/submit/`.
  - 0 console errors and 0 broken images; Geist loads; the result counts match.
  - Previews were recaptured.

## Baseline before changes
`npm ci`; `npm test` 9/9; `npm run build` (`astro check` 0 errors / 0 warnings / 0 hints, 13 pages).

## What changed and why
The owner found the previous UI "clunky" and generic, and supplied screenshots of on.design and a Ruma concept as inspiration, with Phosphor icons that animate on hover. Behaviour, data rules and URL contracts are unchanged.

1. **Shell.** The ruled header and demo bar became a quiet demo strip and a segmented pill navigation with icons. Explore stays marked as the current section on place pages.
2. **Discover.** Editorial headline; search pill with the button inside; area chips; three figures counted from the data; a large rounded photo with a floating sample-listing card showing its evidence; mode tiles with icons and place counts; an evidence legend on a forest field; a large-wordmark footer.
3. **Cards.** The boxed "Save" button became a round heart toggle. The two-row label/pill grid became two compact chips (amenity icon + state words). Category and area are shown with icons. The repeated "Fictional sample · modes" line was replaced by a "Sample · illustrative photo" tag on each photo.
4. **Explore.** Work modes are a segmented control. The native selects sit inside pills with visible labels. The verified filters are toggle pills.
5. **Details.** Icon-led meta line; a white visit panel with icon rows; amenity rows led by icons; mode chips; the policy note as a tinted callout.
6. **Saved.** The compare table has icon headers and a pinned place column, and stays readable on phones.
7. **Icons.** Phosphor through a new `Icon.astro`, read from `@phosphor-icons/core` (new dev dependency, MIT) at build time; no client JS or network. Hover animations are transform-only and disabled under reduced motion.
8. **Photos.** Four Unsplash scenes were added, so each of the eight places has its own illustrative photo instead of four repeated ones. Provenance is recorded in SOURCES.md and on the About page.
9. **Code.** `app.ts` now updates `[data-evidence-label]` and `.save-text` instead of the whole element, so state changes keep their icons. A new-save heart pulse was added.

## Executed checks (final state)
- `npm test`: **9/9 pass**.
- `npm run build`: `astro check` **0 errors, 0 warnings, 0 hints**; 13 static pages.
- `npm run test:e2e` against the dev server: **11/11 pass**. This includes one new test: the heart and the evidence chips keep their icons and accessible text after a state change, and Explore stays current on place pages. The discover test was updated to the new "Search" button name.
- **First dev run, recorded rather than dropped:** the first run on a cold dev server had 2 timeouts, and the overflow test failed because Discover overflowed by 25px at 320px. The overflow was fixed with a `minmax(0,1fr)` hero track and wrapping stats. Later dev runs passed 11/11.
- The same 11 tests against the **production preview** (`astro preview`, port 4321, confirmed free of the dev toolbar and Vite client): **11/11 pass**.
- Production preview, scripted (Playwright Chromium):
  - Horizontal overflow is **0px** on Discover, Explore, filtered Explore, details, Saved, About and the 404 page, both at 320px and at 640 CSS px with DPR 2 (200% zoom of a 1280px window).
  - With `prefers-reduced-motion: reduce`, **0** elements had a transition or animation (62 otherwise). This was superseded in the second round: colour fades now stay.
  - Geist Variable loads, and **0** images are broken after scrolling.
  - Result counts match the visible cards for `?wifi=true` (2), `?q=JLT` (2) and `?mode=Meetings&power=true` (1).
  - **0** console or page errors (`docs/previews/browser-errors.json`).
- **A mistake corrected during this run:** one interim round of screenshots and inspections ran against a leftover dev server on port 4321 (the Astro dev toolbar was visible in the images). Every server was killed, a genuine preview was started, and all screenshots, inspections and checks above were repeated on it.
- Taste Skill (`design-taste-frontend`, app-screen mode):
  - `lint.mjs src`: **0 FAIL, 0 WARN**. Four box-shadows are marked `taste-skill-ignore`: the search focus ring, two inset outlines used as pill borders, and the floating hero card.
  - `inspect.mjs --app` on the production preview at 1440/768/390: **0 FAIL** on all four screens, with 3, 2, 3 and 2 WARN. The first pass had 1 FAIL (the hero card's shadow was too heavy, now 0 2px 8px at 8%) and an icon-chips warning (amenity icons in tinted circles, now plain).
  - Warnings kept on purpose:
    - `palette-cream` is the required brand paper.
    - `app-title-size` reflects the owner's editorial references.
    - `below-fold` on Discover and details: the hero, and the photo with the visit panel, fill the first screen by design.
- Bundle (production): client JS 72.3KB raw / **16.3KB gzip** (unchanged); CSS 33.1KB raw / **8.0KB gzip**; Explore HTML 53.8KB raw / 7.3KB gzip (inline icons). All are inside the 60KB / 25KB budgets. Photos are 110–242KB; scenes 4, 6 and 8 are over the 200KB goal for lower photos.

## Screenshot review
All four screens were captured from the production build at 390, 768 and 1440px into `docs/previews/` (Saved is seeded with demo-01 and demo-03), and each image was opened and reviewed after the last change.

Fixed during review:
- Long names were squeezed by the category label on cards.
- Explore overflowed by 71px at 390px (grid items defaulting to `min-width:auto`).
- The Discover stats were misaligned when a label wrapped.
- The compare table's place column collapsed to one word per line on phones.

Remaining tradeoffs:
- At 1440px, two saved cards leave the right half of the row empty above the full-width comparison.
- The mode tiles are deliberately airy.

## Not performed here
- No VoiceOver or NVDA pass.
- No Safari/iOS, Firefox or Chrome/Android runs (Chromium only).
- No Lighthouse or field performance data.
- No increased-default-font-size audit beyond the zoom emulation above.
- Hover animations were checked in code and by state screenshots, not by recording video.

## Still required before public launch
- Manual screen-reader evaluation, cross-browser and device checks, and lab and field performance.
- An independently sourced real venue inventory with per-amenity evidence, plus an access review.
- Licensed venue photography and a media-rights review.
- Domain ownership and trademark clearance (domain availability remains user-reported).
- A production host, DNS, HTTPS and 404 checks.
- Removal of `noindex` only after all of the above.

No purchase, deployment, venue outreach, payment integration or trademark work was done.
