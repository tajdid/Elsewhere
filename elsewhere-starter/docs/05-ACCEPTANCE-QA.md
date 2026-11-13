# Acceptance criteria and QA
P0 means required for MVP behavior. Production/editorial gates are separate from starter functionality. Automated checks do not certify WCAG conformance or real data accuracy.

| ID | Priority | Given / When / Then | Verification |
|---|---|---|---|
| AC01 | P0 | Given Discover, submit JLT; Explore query is populated and only matching rows remain. Case and surrounding spaces do not change results. | browser + unit |
| AC02 | P0 | Given multiword search “JLT Co-working”, all words must occur across the search corpus; only matching venue remains. | unit |
| AC03 | P0 | Given area/type/mode, changes combine with AND; displayed count equals visible cards. | browser + unit |
| AC04 | P0 | Given each of four work-mode links, Explore activates that radio and every row contains that mode. | browser |
| AC05 | P0 | Given stale/reported/unknown/conflicting/verified-no Wi-Fi, verified Wi-Fi excludes each; current verified yes passes. Same rule applies independently to power. | unit |
| AC06 | P0 | Given timestamp exactly 90 days ago, state is current; older or future timestamp needs recheck. | unit |
| AC07 | P0 | Given a direct Explore URL, controls and results restore; change filter then Back restores prior state. | browser |
| AC08 | P0 | Given no results, useful explanation and Clear filters appear; clear restores eight fixtures and default URL. | browser |
| AC09 | P0 | Given any card, title opens correct slug; unknown slug returns 404 on correctly configured host. | browser + host check |
| AC10 | P0 | Given detail, all five amenities have visible value/state, source/date where available, notes and truthful unknowns. No place-wide verification claim. | manual + unit |
| AC11 | P0 | Given save, aria-pressed/text/name change, navigation to Saved and reload retain ID; remove updates count. | browser |
| AC12 | P0 | Given first-use or corrupt/unsupported saved data, show empty state safely; unknown IDs discarded and duplicates deduplicated. | unit + browser |
| AC13 | P0 | Given storage read/write throws, save remains usable on-page and announces temporary state; Saved explains limitation. | browser |
| AC14 | P0 | Given two same-origin tabs, save/remove or storage clear updates the other tab. | browser |
| AC15 | P0 | Given last saved card removed by keyboard, focus reaches empty Explore link. With more cards, focus reaches next saved button. | browser/manual |
| AC16 | P0 | Given fictional detail, directions opens Google Maps to area only; real object uses encoded validated coordinates/address. External link has safe new-tab attributes. | unit + manual |
| AC17 | P0 | Given JS disabled, Discover GET search still navigates; all listings/details readable; save controls hidden, Saved explains JS need and does not label catalogue saved. | browser/manual |
| AC18 | P0 | Given 390, 768 and 1440px, no page overflow, nav/actions readable, photos reserved, filter disclosure works; at 320px and 200% zoom, content reflows. | screenshots + manual |
| AC19 | P0 | Given keyboard/screen reader, skip link, headings, labels, radio keys, save state, result announcements, focus order and external link context are understandable. | manual NVDA/VoiceOver |
| AC20 | P0 | Given reduced motion, no nonessential transition/animation occurs; content is available immediately. | browser/manual |
| AC21 | P0 | Given all screens, no fake reviews or ratings and a pricing qualifier (“typical ranges”) on details. Demo/fictional labels were removed from the UI by owner decision (13 Nov 2026); therefore no public deployment until real, evidenced venues and licensed photos replace the fixtures, and noindex stays on every page. | editorial |
| AC22 | P0 | Given dependency lock and clean install, tests and Astro check/build pass; static pages emit all eight slugs. | automated |
| AC25 | P0 | Given any card, detail row or comparison cell, each amenity's evidence shows as words plus a tone; only a current verified yes uses the positive (lime) tone, and stale, reported, conflicting, verified-no and unknown never do. | unit + browser |
| AC26 | P0 | Given an Explore URL with an unknown mode or type, the controls fall back to Any/All; on a narrow screen the closed Filters button states how many hidden filters are active. | browser |
| AC27 | P0 | Given saved places, Saved shows a comparison table with one row per saved place and five evidence cells; removing the last save hides the table and shows the empty state. | browser |
| AC23 | Launch | Given real assets/content, evidence review, rights, brand/domain checks, HTTPS, host 404 and metadata pass before public indexing. | owner sign-off |
| AC24 | Launch | Given mobile lab tests and then field data, performance meets PRD targets or variance is documented with remediation. | Lighthouse + field |
| AC28 | P0 | Given /submit/ or a place's “Report what you found”, invalid name/area/future date shows inline errors and focuses the first; a valid report is POSTed to PUBLIC_SUBMIT_ENDPOINT when set (failure keeps the form and offers retry) or saved locally with copy saying it was not sent; confirmation takes focus and the report appears in “Your reports”. | browser |
| AC29 | P0 | Given Discover, the featured carousel shows five listings with name, type and area only; Previous/Next wrap around, dots jump to a slide and show the current one, the change is announced politely, off-screen slides are inert, swiping works without JavaScript, and autoplay advances every 3 seconds. Autoplay pauses on hover, on focus and in a hidden tab, stops with a labelled Pause button, and is off under reduced motion. |
| AC30 | P0 | Given a place with Wi-Fi details or hours, cards, details and Saved show the speed with its test date (“needs retest” after 90 days or when future-dated), the access method without any password, and usual hours for today in Dubai time worded as “Usually …”, never “open now”. Places without the data say “Speed not tested”, “Access not checked” or “Hours not checked”. The report form accepts an optional speed (number up to 2000) and an access answer, and never a password. |

## Test commands
`npm test` runs the data/logic contracts with an injected verification clock. `npm run build` runs strict Astro/TypeScript diagnostics then emits static output. `npm run test:e2e` uses a local dev server and Chromium; install browser via Playwright first. Browser fixture tests freeze only evidence evaluation where needed through date-specific unit tests; UI expectations avoid assuming today's verification stays current indefinitely.

## Manual test script
1. New browser/profile, no saved IDs. Enter JLT; choose Focus; open The Long Table Works; read laptop evidence.
2. Return with Back. Reset; try Meetings, Together, Casual and Focus separately. Try café/restaurant/hotel/co-working and six areas. Force empty state and reset.
3. Save two different venues from card and detail. Reload Saved. Remove both with keyboard and watch focus. Clear site storage, retry. Open two tabs and repeat.
4. Disable local storage via browser policy/test harness. Save and confirm the on-page-only announcement; navigate and confirm no durable promise.
5. Disable JS. Browse Discover, Explore, details, Saved. Confirm no control claims to have saved and no full catalogue appears in Saved.
6. Resize 320/390/768/1440, zoom 200%, increase default font, inspect long names. Tab every action. Use VoiceOver or NVDA for headings, radio group, result count, Saved and Maps context.
7. Turn on reduced motion; emulate slow image loading and image failure. Ensure content and links remain usable.
8. Before launch replace all fixtures; independently validate external directions and editorial source dates. Check HTTP 404 on selected host.

## Budget and quality gates
Static HTML with one lightweight client module, no React runtime or map SDK. Budget goals: client JS ≤60KB gzip, primary photo ≤250KB, lower photos ≤200KB each, CSS ≤25KB gzip. Report actual sizes rather than claiming budgets pass. Real photos may need different crops/resolutions and responsive sources. Test critical paths in Safari/iOS and Chrome/Android before launch; Chromium automation alone is insufficient.

