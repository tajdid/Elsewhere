# Validation and delivery report
13 November 2026 · Run by Claude Code (Opus 5.5) on macOS (Darwin 25.6), Node 26.5.0, Astro 5.18.2 (locked), Playwright 1.64.1 with Chromium build 1248. Every result below was produced in this session. It supersedes the 3 November report, whose changes (evidence pills, Saved comparison, filter fixes) are kept.

## Twenty-fourth round (same day): hero map removed
- **Owner decision:** the map felt too overpowering. Removed `HeroMap.astro`, `hero-map.ts`, their styles and the hero's stacking context. The Discover hero is back to plain paper. `html{overflow-x:clip}` stays as a harmless guard.
- **Checks:** `npm run build` passed; no references to the map remain. No tests were run.

## Twenty-third round (same day): mobile view
- **Review:** full-page screenshots of all six pages at 390px. Explore was about 25,000px tall (53 full-width photo cards), and the header took two rows.
- **What changed:**
  - Bottom tab bar for Discover, Explore and Saved; the header is one row.
  - Compact row cards.
  - 16px filter selects.
  - `viewport-fit=cover` with safe-area insets.
- **Fixes during the round:**
  - Card content painted over the fixed bar, because the header was a stacking context below the content. The header now has `position:relative;z-index:40`.
  - At 320px the type and area line ran under the heart; it now has right padding.
  - The bar's reserved space showed as a strip under the footer; it moved into the footer's padding.
- **Checks:**
  - `npm run build` passed.
  - Explore is about 8,600px at 390px. Screenshots at 390 and 320px of Explore, Discover, a place page, Saved and Submit.
  - Tapping the Saved tab navigates.
  - The overflow check found no overflow at 320px or 200% zoom on 9 routes; no console errors; no broken images.
  - No unit or browser tests were run.

## Twenty-second round (same day): hero map
- **Owner request:** a map background in the Discover hero, inspired by usehallmark.com's topographic hero with a loupe. It is our own drawing, not a copy: a schematic map of Dubai in the site palette, with pins for the areas in the list, plus a loupe that follows the mouse.
- **Iterations from screenshots:**
  1. The Palm and its labels sat behind the headline, so the coast was lowered: the headline now sits over calm sea.
  2. The Palm hid behind the search box, so the districts moved into the visible band below the search.
  3. The Palm and Media City labels collided, so Media City and Al Barsha moved along the coast.
  4. The loupe was faded by the map's mask, so it moved to its own layer.
- **Checks:**
  - `npm run build` passed. Screenshots at 1440, 1280, 1024 and 390px.
  - The loupe magnifies the map under the pointer.
  - No horizontal overflow: `html{overflow-x:clip}` contains the full-bleed layers. No page errors.
  - No tests were run.

## Twenty-first round (same day): footer logo motion
- **What changed:** the footer wordmark reveals letter by letter the first time it scrolls into view, and each letter lifts under a mouse pointer. It is armed only by script and never under reduced motion.
- **Checks:**
  - `npm run build` passed.
  - In Chromium, the logo was armed before scrolling, and frames at 250, 600 and 1700ms showed the staggered rise, with classes cleared afterwards.
  - Hovering the "l" applied translateY(-3.36) in SVG units, which cleared on leave.
  - A first hover test on the open centre of the "w" did nothing because it missed the fill; `pointer-events: bounding-box` was added for that.
  - No page errors. No tests were run.

## Twentieth round (same day): logo animation
- **What changed:** the header logo's letters rise in, staggered, once per visit, and a small wave runs across them on hover. The wave always completes (`logo.ts`), and the intro class is cleared after it plays. Both are off under reduced motion.
- **Checks:**
  - `npm run build` passed.
  - In Chromium, frames at 150, 350 and 600ms showed the letters rising left to right, and a hover frame showed the wave.
  - The intro class was cleared after it played; the wave class was cleared after leaving; there was no intro on the second page. No page errors.
  - No tests were run.

## Nineteenth round (same day): Wi-Fi row on every card
- **What changed:** cards without a listed password get the same Wi-Fi row, with no Copy button. It reads "No password" (open lock), "Ask staff for the password", "Sign-up page" or a muted "Wi-Fi access not added".
- **Checks:** `npm run build` passed. All 53 cards render the row at the same height (34px) at 1440px. Screenshot reviewed. No tests were run.

## Eighteenth round (same day): outline functional icons, Wi-Fi password with Copy
- **What changed:**
  - Functional icons (search, arrows, carets, plus, close, filters, copy, directions) default to outline; everything else stays filled.
  - Guest passwords from the owner's list (13 places) are now imported as `wifiAccess.password`.
  - Cards show the password with an icon-only Copy button; it sits above the card's link, so copying doesn't navigate.
  - The place page shows it in the panel with a labelled Copy button and "Listed <month>. If it doesn't work, ask staff; passwords change."
  - Copy uses the Clipboard API and announces "Wi-Fi password copied." If the clipboard isn't available, it selects the text instead. The buttons stay hidden without JavaScript, so only the plain text shows.
- **Checks:**
  - `npm run build` passed.
  - In Chromium with clipboard permission, copying from the Friends Avenue JLT card put "friends3" on the clipboard and stayed on Explore. Copying from its place page did the same and announced it.
  - Screenshots reviewed; no page errors. No tests were run.

## Seventeenth round (same day): place page redesign
- **What changed:**
  - Save sits beside the name, and the empty-notes placeholder is gone.
  - "Plan a visit" gained Wi-Fi access, a Links row and the laptop tip. Missing hours read "Not added yet".
  - "Will it work for you?" became "What we know": compact rows for known amenities, with unknowns collapsed into one line.
  - The duplicate Wi-Fi speed/access panel was removed; speed is in the tiles and explained in the Wi-Fi row.
  - "Work modes" became "Good for", and "Before you visit" moved into the panel. The report prompt asks for whatever is missing.
- **Checks:**
  - `npm run build` passed.
  - Screenshots of A4 Space and Friends Avenue at 1440px, and LDC Kitchen at 390px.
  - No horizontal overflow at 320 or 390px, and no stat tile overflows. That needed smaller large-stat type on phones: "Moderate" first overflowed at 390px, then by 2px at 320px.
  - No page errors. No tests were run.

## Sixteenth round (same day): filled icons everywhere
- **What changed:** `Icon` now defaults to the Phosphor fill weight, and the evidence glyph masks use fill too. Unsaved hearts stay outlined: Save buttons, the Saved nav item when it isn't the current page, and the empty Saved state.
- **Checks:** `npm run build` passed. Explore and a place page were screenshotted with no page errors. No tests were run.

## Fifteenth round (same day): photos back, clickable cards, filled icons
- **What changed:**
  - Places got temporary stock photos, by type. Alt text and credit say they aren't the venue, and the place page captions each one "Temporary photo, not this place".
  - The card is photo-led again: name, type and area, then one row of filled-icon facts (Wi-Fi Mbps, sockets, noise), with "–" when a fact is missing.
  - The whole card is one link: the title's link is stretched over the card. Save sits above it and stays a separate button, so no control is nested inside the link.
  - Wi-Fi access, entry and directions moved off the card to the place page.
  - The Discover carousel is back to photos with the floating card. The stat tiles use filled icons.
- **Checks:**
  - `npm run build` passed (0 errors).
  - In Chromium on the production preview, a click on a card's photo opened its place page, and a click on its heart saved it without navigating.
  - No horizontal overflow at 1440 and 390px. Explore, Discover and a place page were screenshotted.
  - One console message, "Transition was aborted", came from the test script navigating away during a view transition, not from user flows.
  - No unit or browser tests were run, and they are still outdated (see the fourteenth round).

## Fourteenth round (same day): real places from the owner's list, redesigned cards
- **What changed:**
  - Replaced the 8 fictional fixtures with the 53 places from the owner's Notion list (mapping in docs/04).
  - Cards are now information-led: type and area, Save, the name, three stat tiles (Wi-Fi Mbps, sockets meter, noise), Wi-Fi access, entry, visited/added month, and Directions or Find on Maps. Every place shows the same rows, with “Not added” placeholders.
  - The place page shows large stat tiles where the photo was, plus menu and website links when present, and a labelled Google Maps search when there is no map link.
  - The Discover carousel shows colour panels, not photos. “A few places to begin” picks the most complete listings.
  - Because nothing in the list is independently verified, the Verified Wi-Fi and Verified power filters, which would always return zero, are replaced by 50+ Mbps, Plenty of sockets (4–5) and OK for calls (quiet or moderate).
  - Photo credits are replaced by “Where the list comes from”.
- **Checks:**
  - `npm run build` passed (0 errors).
  - Explore, Discover and two place pages were screenshotted at 1440 and 390px: one full listing, and one with no data.
  - No overflow and no page errors; `?fast=true&calls=true` returns 10 places.
  - **Not run, at the owner's request:** unit and browser tests. They still reference the old fictional places (counts, slugs, demo IDs) and need rewriting before they can pass.

## Thirteenth round (same day): smoother page changes
- **Owner request:** pages felt static and seemed to jump when following a link.
- **What changed:**
  - Native cross-document view transitions, with the header fixed and the content fading and rising 8px.
  - Astro hover prefetch for all links.
  - Geist preloaded.
  - `scrollbar-gutter: stable`.
  - The navigation pill placed instantly on load. Before, it faded in on every page, which flickered.
- **Checks:**
  - `npm run build` passed.
  - In Chromium, hovering Explore prefetched `/explore/`, and a screenshot mid-navigation showed the header still while the pages cross-faded.
  - The pill sat on Explore after arriving; the gutter computed as stable; there were no console or page errors.
  - No tests were run, at the owner's request. Firefox does not support cross-document view transitions yet and navigates as before.

## Twelfth round (same day): sliding navigation pill
- **What changed:** the main navigation's white active background now slides to the hovered or keyboard-focused item and back to the current page (`src/scripts/tabs.ts`). Touch taps don't move it. Reduced motion keeps only the fade.
- **Checks:** `npm run build` passed. The navigation was screenshotted before, during and after a hover on Saved, and on `/submit/`, where the pill is correctly hidden. No page errors. No tests were run, at the owner's request.

## Eleventh round (same day): new logo
- **What changed:** the header and footer wordmarks now use the owner-supplied logo SVG, as `src/components/Logo.astro` in `currentColor`. The arrow glyph is gone.
- **Checks:** `npm run build` passed, and the header and footer were viewed at 1440 and 390px. No tests were run, at the owner's request.

## Tenth round (same day): contribution band replaces the evidence legend
- **Owner request:** replace the "Know before you go" evidence legend on Discover with something else.
- **What changed:** the forest band now invites contributions. "Know a good spot?" is followed by Submit a place and Browse places, beside three steps: add the place, say what you found, we check it. The evidence legend still lives on About.
- **Checks:** `npm run build` only (results below). No tests, at the owner's request.

## Ninth round (same day): simpler Discover hero, carousel autoplay
- **Owner request:**
  - Remove the area chips and figures from the Discover hero.
  - Advance the carousel every 3 seconds.
  - Run no further tests for this round.
- **What changed:**
  - The chips and the three figures are gone.
  - The carousel autoplays every 3 seconds, with a Pause/Play button added to its controls for WCAG 2.2.2. Autoplay pauses on hover, on focus and in a hidden tab, and is off under reduced motion.
- **Checks:** at the owner's request, only `npm run build` was run (results below). Unit, browser, overflow and screenshot checks were **not** rerun for this round. The browser carousel test predates autoplay and may need its timing adjusted, for example by emulating reduced motion, the next time it runs.

## Eighth round (same day): Wi-Fi speed, access and usual hours
- **Owner request:** take content inspiration from a Wi-Fi directory, which shows speed in Mbps with an update date, the password with Copy, "Open today" hours, Website and Directions, "Submitted by", and star ratings.
- **Adopted, as dated evidence:**
  - Wi-Fi speed: one test, with its tester, date, plain-language tier and a "needs retest" rule.
  - Wi-Fi access: no password, password from staff, or sign-up page.
  - Usual weekly hours: shown as "Usually … today" in Dubai time, with the week, its source and date.
  - An optional website field.
  - Where they appear: cards, place details and the Saved comparison. The report form gained an optional speed and an access answer.
- **Not adopted:**
  - Star ratings: there is no real rating data.
  - Passwords with Copy: they change, and venues may not want them published.
  - "Open today" as a live status: replaced by "Usually …".
  - "Submitted by @user": there are no accounts.
- **Data:** fictional fixtures extended to match each place's existing Wi-Fi evidence; `isSample` and `noindex` unchanged. The schema rejects speed or access on a place with no Wi-Fi, known access without a source, and malformed times.
- **Incident:** a script truncated `src/pages/places/[slug].astro` to zero bytes: it opened the file for writing before reading it. The file was rebuilt from its last read state in this session plus the new sections, the diff against HEAD was reviewed, and the page rendered and passed its tests.
- **Checks (production preview, port 4330):**
  - `npm test` **15/15**, with new tests for speed tiers and staleness, Dubai weekday, time formatting, schema guards and report parsing.
  - Build 0 errors.
  - `E2E_BASE_URL=… npm run test:e2e` **16/16**. The new test covers card facts, the stale retest label, no "open now" text, the details speed panel, today marked in the week, and form validation and storage of speed and access.
  - No overflow on 9 routes at 320px or at 200% zoom; no console errors; filter counts agree.
  - Taste inspector (`--app`) 0 FAIL on `/explore/` and a place page.
  - Screenshots reviewed at 1440 and 390px. That review led to two fixes: the phone Wi-Fi panel now stacks its labels, and the compare table's hours column got a minimum width.

## Seventh round (same day): area chips removed from Explore
- **Owner request:** remove the Explore area chips, because they will get crowded as more areas are added. Areas are chosen with the Neighbourhood select only.
- **Removed:** the chips markup, their script, their styles, their browser test and AC30. The centred header, the removed filter note and the phone search layout from round six stay. Discover's four area shortcuts are unchanged.
- **Checks (production preview, port 4330):** `npm test` 11/11; build 0 errors; `E2E_BASE_URL=http://localhost:4330 npm run test:e2e` **15/15**. No overflow on 9 routes at 320px or at 200% zoom; no console errors or broken images. Explore screenshots were reviewed at 1440 and 390px.

## Sixth round (same day): Explore header
- **Owner request:**
  - Put the area chips on Explore.
  - Remove the note under the filters (“Verified filters only include…”).
  - Centre the header.
- **What changed:**
  - Explore's title, description and the JVC / JLT / Dubai Marina / Business Bay chips are centred. From 768px up, the search, mode control and filter row are centred too.
  - Chips are links without JavaScript. With it, they toggle the neighbourhood filter in place: the active chip is filled in ink, a second press clears it, they follow the select and history, and they announce politely.
  - The filter note is removed. The rule stays on About and in the zero-results message.
  - Below 640px the search takes the full width and Filters sits on its own row; before, the button squeezed the placeholder to “Try ,”.
- **Checks (production preview, port 4330):**
  - `npm test` 11/11; build 0 errors.
  - `E2E_BASE_URL=http://localhost:4330 npm run test:e2e` **16/16**. The new test covers chips filtering, the active state, a second press clearing the filter, Back restoring it and select sync.
  - No overflow on 9 routes at 320px or at 200% zoom, and none on Explore at 320, 390, 768 and 1440px. No console errors.
  - Taste inspector (`--app`) on `/explore/`: 0 FAIL, 3 WARN.

## Fifth round (same day): featured-places carousel
- **Owner request:** turn the hero photo into a carousel of five places, without the evidence pills.
- **What changed:**
  - Discover's hero is now a carousel of five listings. Each card shows name, type and area, and links to the place.
  - Controls: Previous / Next, which wrap around, and five dots. Swiping uses native scroll-snap. There is no autoplay.
  - It is labelled "Featured places", not "Top 5": there are no ratings to rank by.
  - New `src/scripts/carousel.ts`.
- **Server correction:** a dev server (`astro dev`, started 14:28 and not by this work) was holding `[::1]:4321`. Round four's checks, and its browser tests (the Playwright config reused port 4321), therefore ran against development rendering, not the production preview as round four's entry first said.
  - The dev server was left running.
  - `playwright.config.ts` now accepts `E2E_BASE_URL` and skips its own web server when that is set.
  - The no-JavaScript test no longer hard-codes `localhost:4321`.
  - Every check below ran on `astro preview --port 4330`, confirmed to serve no dev toolbar or Vite client.
- **Checks:**
  - `npm test` 11/11; `npm run build` 0 errors.
  - `E2E_BASE_URL=http://localhost:4330 npm run test:e2e`: **15/15**. The new carousel test covers 5 slides with no evidence pills, Next, the announcement, an inert off-screen slide, wrap-around with Previous, a dot jump and the link.
  - No overflow at 320, 390, 768 and 1440px or at 200% zoom on 9 routes; no console errors; no broken images; filter counts agree.
- **Fix during this round:** rapid clicks fought the smooth scroll and could jump back a slide. The scroll listener now ignores positions until the requested slide is reached.
- **Card shadow removed:** without its pills, the inspector read the floating card as a button and failed it for a shadow. The card is now flat white on the photo. Taste inspector on `/`: 0 FAIL, 3 WARN (fixed brand palette, h1 size, sections below the fold).
- **Test artefact, not a bug:** Playwright's element screenshot of the tall phone hero resets horizontal scroll. Viewport screenshots confirmed the right slide shows.

## Fourth round (same day): evidence field and footer redesign
- **Owner request:** improve the "Know before you go" section and the footer visually.
- **Evidence field:**
  - Larger headline, plus Submit a place beside How evidence works.
  - The legend now sits in a darker panel with a title, hairline-divided rows and a note that only Yes · Verified passes the Verified filters.
- **Footer:**
  - Tagline with a description.
  - Find / Contribute / Elsewhere link columns in a labelled Footer nav.
  - An oversized wordmark sized to fit the content width.
  - A base row with the browser-local saves note and Back to top. The About page gained an `#reports` anchor.
- **Checks** (these ran against a dev server on port 4321, not the production preview; see the fifth round. They were repeated on the production preview in the fifth round):
  - No horizontal overflow at 320, 390, 768 or 1440px. The wordmark arrow ends inside the content edge at 320 to 1920px.
  - No overflow at 200% zoom on 9 routes; no console errors; no broken images.
  - `npm test` 11/11; `npm run build` 0 errors.
  - `npm run test:e2e` 14/14, after scoping one locator to the main navigation: the footer added a second "Saved" link, which broke a strict-mode lookup.
  - Taste inspector on `/`: 0 FAIL, 4 WARN. The remaining warnings are the fixed brand palette, the preview server flagged as a dev server, the h1 size and the count of sections below the fold. The inspector read the legend's translucent dividers as heavy borders, so they are now a solid `#36543F`.
- **Docs:** the stale demo-strip and sample-label wording in docs/03 was corrected at the same time.

## Third round (same day): real-product copy and working submissions
- **Owner request:** remove every mention of demo, MVP, sample, fictional or illustrative from the UI so it reads as a real product, and add submissions and checking.
- **What was removed:** the demo strip, the photo tags and “does not depict” captions, the “Fictional sample” tags, and fictional wording in the places data (sources, notes, prices, alt text, policy notes and duplicated “concept” summaries). A scan of all 14 built HTML pages finds none of those words.
- **Guardrails kept** (CLAUDE.md, AGENTS.md and README updated to match):
  - `isSample` stays in the data.
  - All 14 pages keep `noindex`.
  - The docs state that the fixtures and photos must be replaced before any public launch.
- **Submissions and checking:**
  - `/submit/` is a validated form, with “Report what you found” on each place page via `?place=`.
  - It POSTs JSON to `PUBLIC_SUBMIT_ENDPOINT` when that is set; otherwise it saves to local storage and says so.
  - It never claims receipt without an accepted POST: the confirmation heading is “Report saved.” for a local save and “Thanks, that’s in.” for a send.
- **Tests:**
  - `npm test` **11/11** (new: validation including Dubai-date future check, payload cleaning, stored-report parsing and cap).
  - `npm run build`: 0 errors / 0 warnings / 0 hints, 14 pages.
  - `npm run test:e2e` on the production preview: **14/14**. New tests cover new-place validation, local save and history; a report on a listed place with a refused future date; and an endpoint run where a first failure keeps the form and a retry POSTs and shows Sent.
- **Fixes during this round:**
  - A type error in a new unit test failed one build, so the preview briefly served stale files; it was fixed and everything re-run.
  - A test clicked the label text instead of the radio.
  - Amenity answer rows wrapped unevenly on phones.

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
