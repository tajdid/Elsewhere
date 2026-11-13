# Elsewhere · MVP specification and implementation handoff

Version 1.2 · 13 November 2026 · regenerated from elsewhere-starter/docs after the visual redesign (Phosphor icons, rounded photo cards, segmented controls)

Work from somewhere new.

The elsewhere-starter/ folder contains runnable source, fixtures, tokens, tests and screen previews. All sample venues and evidence are fictional. Local run steps are under "Implementation, Codex and local operations"; Taste Skill setup is in the same chapter.


---

# Product requirements · Elsewhere MVP
Version 1.0 · 3 November 2026 · Working brand: Elsewhere · Intended domain: elsewhere.work

## Product and problem
People working away from home need to find a suitable Dubai venue without treating an attractive photograph or a generic “laptop-friendly” tag as evidence. Elsewhere is a curated discovery website for cafés, co-working spaces, restaurants and hotel lounges. It helps a visitor decide where to investigate, what is known and what to confirm before travelling.

**Value proposition:** Find a setting for your workday and see the evidence behind its practical details.
**Tagline:** Work from somewhere new.
**Voice:** curious, welcoming, considered; plain, specific and candid about uncertainty. No “hidden gem”, “best Wi-Fi” or “perfect for calls” without support.

## Audience and jobs
| Audience | Context | Primary job | Important uncertainty |
|---|---|---|---|
| Resident remote worker | Phone before leaving home | Find a place nearby for two hours of work | Laptop policy, sockets, Wi-Fi |
| Freelancer between appointments | Phone, changing neighbourhood | Find a casual place for email and a break | Spend, location, time restrictions |
| Pair or small team | Shared shortlist | Find a setting for working together | Seating, calls allowed, booking requirements |
| Visiting worker | Unfamiliar with Dubai | Understand venue type and neighbourhood | Costs, access and venue policy |

Do not imply every restaurant or lounge accepts laptops. Inclusion is editorial and must be supported before real launch.

## Outcomes and proposed targets
These are proposed validation targets, not existing business results.
- In a five-person usability round, at least four can find a plausible candidate and inspect laptop-policy evidence within two minutes without instruction.
- All production positive “verified” claims have a source and observation timestamp; zero unlabelled synthetic claims.
- At least four of five can save, reopen Saved, and remove a place without assistance.
- Mobile Core Web Vitals launch targets: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at p75 once field data exists. Lab testing is a proxy until then.
- Zero critical keyboard or screen reader blockers across the four journeys.

Optional future events: search_submitted (no raw query), filter_changed (enum only), place_opened, save_toggled, directions_opened. No analytics is shipped. Define a privacy approach and consent requirements before adding any measurement service. Do not collect precise location by default.

## Scope and priority
### P0: implemented starter
1. Discover: concise introduction, search, neighbourhood shortcuts, four work modes, photo listings and trust explanation.
2. Explore: all listings; query, neighbourhood, type, single work mode, independently verified-positive Wi-Fi and power filters; AND semantics across groups; visible result count, reset and zero-results state; URL state and Back/Forward restoration.
3. Details: photograph, category and area, summary, amenity value and evidence state, source, date, notes, indicative spend, hours uncertainty, laptop policy, work modes, save and external directions.
4. Saved: current-browser shortlist, save/remove, empty state, reload persistence, validation of stored IDs, safe behavior for unavailable storage.
5. Static Astro pages, strict TypeScript, Tailwind 4, local fonts and photos, accessible native controls.
6. Fictional sample data, deterministic filter tests, build checks, browser tests and launch checklist.

### Production content required before launch
Real venues, independent fact checks, current photo permissions, real directions endpoints, independently reviewed access information, approved copy and brand clearance. The starter is not a completed editorial dataset.

### Explicitly deferred
Authentication; booking/payment; public submissions and reviews; ratings; live occupancy, Wi-Fi speed or opening status; distance sorting and geolocation; embedded interactive maps; admin CMS; multi-city and Arabic localization; cloud sync; notifications. No buttons suggest these exist.

## Work modes
Mode is an editorial recommendation with reasons and date to be recorded when replacing samples. It does not derive automatically from category or Wi-Fi.
| Mode | User intent | Real-world evidence to review |
|---|---|---|
| Focus | Concentrated solo work | Laptop window, noise observation with time context, seating |
| Casual | Light work with food or coffee | Laptop acceptance, typical spend and visit restrictions |
| Meetings | Conversation with others | Call/conversation policy; privacy is never assumed |
| Together | Working beside a small group | Group seating and booking policy; availability not promised |
Only one mode filter is active at a time. A place may have several modes. Unknown calls never become a positive call claim just because Meetings is selected.

## Core journeys
1. Discover → select Focus → Explore with `mode=Focus` → narrow to JVC → inspect a detail → inspect laptop policy/source/date → directions or save.
2. Direct shared Explore URL → same selected controls and results → open detail → browser Back restores Explore state.
3. Save from a card → pressed state updates → navigate to Saved → reload → remove → accurate count and empty state.
4. Select verified Wi-Fi + verified power → retain only current positive independent evidence for both → empty explanation if none → clear filters.
5. Storage disabled → save still responds on page → live announcement explains temporary save → Saved explains restriction; no misleading durable-save promise.

## Product rules and constraints
- Search is case-insensitive, whitespace-trimmed, all words must match across name, area, category and summary. No fuzzy ranking in MVP. Curated data order is stable; no sponsored ranking.
- “Verified Wi-Fi” requires yes + verified + ≤90 days old + non-future timestamp. It means availability, never measured speed.
- Conflicting, reported, stale, unknown and verified-negative evidence fail positive amenity filters. Counts derive from the same matching dataset as cards.
- Price is an explicit indicative range and unit, not a guaranteed minimum. No price filter until price data is normalized.
- No “open now” because hours are not verified or represented as a schedule.
- Missing data is visible as “Not checked”. No icon-only positive ticks. Evidence belongs to the amenity, not the venue as a whole.
- Places without a validated address get neighbourhood-level directions, and the visit panel says the link opens the area. Real venue directions require validated address or coordinates.
- Date display uses Asia/Dubai; storage timestamps use UTC ISO 8601. Verification aging uses elapsed 24-hour periods.

## Launch ownership and gates
Product owner approves scope and copy. Editor owns venue source collection and rechecks. Designer reviews mobile/desktop and contrast. Engineer owns tests, performance and hosting. Assign actual owners before launch; no team members are assumed here.

Launch only after: replace/remove all samples; check every laptop-policy claim; approve media rights; validate every directions target; resolve brand/domain ownership and trademark questions; pass acceptance and accessibility checks; remove demo noindex deliberately; approve privacy statement; configure host 404 and HTTPS. Domain availability was user-reported, not independently rechecked or purchased.

## Risks and unresolved decisions
- Venue policies change: 90-day review period is an MVP policy, not an industry standard; shorten for volatile facts.
- Observation bias: distinguish a weekday morning visit from every hour of every day.
- Photo appeal may imply confidence: keep evidence visible beside the listing.
- Browser-only saves can be lost: state limitation where users save and in Saved.
- No CMS: editorial updates require a source change and static rebuild.
- Real launch inventory size, monetization, venue outreach method and analytics provider remain product decisions; none blocks the runnable prototype.


---

# Design system and tokens
## Direction
A calm, photography-led city guide: large rounded photographs invite a closer look, and compact evidence chips support the decision. The 13 November 2026 redesign replaced a boxy, rule-heavy first pass that the owner judged "clunky". It takes cues, not layouts or assets, from two owner-supplied references: on.design (neutral ground, big rounded image cards, a grey segmented pill navigation with a white active pill, quiet metadata under each image) and a Ruma real-estate concept (an editorial headline, a search pill with the button inside it, icon chips under the search field, a photo with a floating listing card, and a short row of figures). Mobbin remains a reference for clarity and density.

Signature element: work intent → visible amenity evidence. The product's face comes from warm paper, forest green used sparingly, the Elsewhere outward arrow, local area names, real neighbourhood shortcuts and photographs. The arrow is a navigation gesture, not a trademark-cleared logo.

Taste Skill (`design-taste-frontend`, app-screen mode) was used for the gate and review. Intentional deviations from its defaults, at the owner's request: soft 20–24px card radii and pill controls (its "soft" mode), a segmented pill navigation, editorial title sizes, and the required cream paper ground. No gradients, glass, emoji, eyebrows, index numbers or tinted icon tiles.

## Semantic palette
| Role | Token | Value | Usage |
|---|---|---|---|
| Paper | `--ground` / `--color-paper` | #F7F6F2 | Page ground |
| Raised | `--raised` | #FFFFFF | Search field, select pills, chips, visit panel, active nav pill, floating hero card |
| Surface | `--surface` | #EDECE5 | One tone step: segmented tracks, mode tiles, footer, empty states |
| Surface hover | `--surface-2` | #E4E3DA | Hover on surface tiles |
| Ink | `--text` / `--color-ink` | #20231F | Titles, running text, selected segment/toggle fill |
| Muted | `--muted` | #585E54 | Secondary copy and metadata (≈6.2:1 on paper) |
| Forest | `--accent` / `--color-forest` | #285943 | The one primary action per context, focus ring, saved heart, the "Know before you go" field |
| Lime | `--signal` / `--color-lime` | #DCE9B5 | Saved state and current verified yes only; never small text on paper |
| Sand | `--caution` | #F0E9D6 | Reported, conflicting, needs-recheck pills; storage notice |
| Neutral | `--negative` | #E4E5DC | Verified-no pill |
| Structural border | `--border` | #DEDDD3 | Card/field outlines and row rules |
| Control outline | `--control` | #767E70 | Hover outline on fields |

White is a neutral addition for raised fields; the four brand colours are unchanged. Do not communicate evidence state by colour alone. There is no dark theme in this scoped MVP.

## Icons
[Phosphor](https://phosphoricons.com) (MIT), from the `@phosphor-icons/core` dev dependency, inlined as SVG at build time by `src/components/Icon.astro` (no runtime request or JS). Regular weight at 14–26px in the text colour or muted; fill weight for the active nav item and the saved heart. Evidence-state glyphs (check, x, warning, minus) are CSS masks generated in `Layout.astro`, so a pill can change tone at visit time. Icons are always `aria-hidden`; a visible label or an `aria-label` names every control. Mappings live in `src/lib/ui.ts`: categories (coffee, desktop, fork-knife, armchair), modes (headphones, coffee, chats-circle, users-three), amenities (wifi-high, plug, laptop, phone-call, wheelchair).

## Typography
Self-hosted `@fontsource-variable/geist`, variable weight, one family. Fallback system-ui, sans-serif.
- Wordmark: the supplied “Elsewhere” logo SVG (294×50), inlined by `src/components/Logo.astro` with `fill="currentColor"` in ink. It is 22px tall in the header (20px on phones). The footer repeats it at the full content width above a hairline base row. Both copies are links named “Elsewhere home”.
- Discover headline: 46–80px, 600, leading 0.98, -0.055em; 38–52px on phones.
- Page titles: Explore/Saved 34–46px (32px phone); place name 36–56px. Section titles 24–28px. Leading 1.08, -0.035em, balanced wrapping.
- Card title: 18px desktop, 20px phone, 600.
- Lead: 19px/1.55 (17px phone). Body 16px/1.5. Card summary and evidence notes 14–15px. Metadata 13–14px. Photo tags 11.5px; nothing smaller.
- Figures (Discover stats): 32px, tabular. Sentence case everywhere.

## Layout and spacing
4px base. Max width 1320px; desktop gutters 32px; phones 16px.
- ≥1000px: four listing columns, 20px gaps. Discover hero is text / photo at 1 : 1.05 with a 64px gap. Detail is 2fr / 1fr: photo then evidence on the left, a sticky white "Plan a visit" panel on the right.
- ≤999px: two listing columns; 2×2 mode tiles; Explore filter disclosure ("Filters · N active").
- ≤860px: the segmented nav takes its own full-width row under the wordmark.
- ≤767px: hero and detail stack (detail: photo → visit → evidence).
- ≤639px: one listing column; select pills go full width; the work-mode segmented control scrolls inside itself, never the page.
- ≤359px: nav and mode icons hide; labels stay.
- Ratios: listing photo 4 : 3.1; hero 1 : 1.02 desktop, 1.2 phone; detail 1.75 desktop, 1.35 phone.
- Sections on Discover sit 96px apart (64px phone).

## Components and states
- **Navigation:** grey `--surface` track with pill links (icon + label); current page is a white pill with a filled icon. On place details, Explore is marked `aria-current="true"` as the current section. At the top right, a white outlined “Submit a place” pill with a plus icon (outline turns ink when current) replaced the static “Dubai” label; Dubai is still named in the hero, the copy and every area.
- **Search pill:** white, fully rounded, magnifying-glass icon, input, and a forest "Search" button inside. The label is visually hidden; the icon, placeholder and adjacent button make the purpose visible.
- **Chips:** white pills with an icon (area shortcuts, work-mode links).
- **Work modes (Explore):** native radios as a segmented control; selected = ink fill with paper text; focus ring on the segment via `:has`.
- **Select pills:** native `<select>` without native chrome inside a white pill that shows its visible label ("Place type", "Neighbourhood") and a caret.
- **Toggles:** native checkboxes as pills; checked = ink fill plus a check icon.
- **Cards:** no box. Rounded 20px photo with a round 44px heart Save button; below, the title link, category and area with icons, the summary, and two compact evidence chips (amenity icon + state words; the amenity name is in visually hidden text and a `title`).
- **Evidence pills:** 26px, 13px/500, fully rounded. Positive (current verified yes) = lime + check; negative (verified no) = neutral + x; caution (reported, conflicting, needs recheck) = sand + warning; unknown (not checked) = transparent with an inset outline + minus. Tone comes from `evidenceTone()`; the words always carry the meaning.
- **Save:** heart outline → filled forest heart on lime; the label variant on details reads "Save"/"Saved". `aria-pressed` plus an action-specific `aria-label`.
- **Forms:** labels above fields; white 48px fields with 14px radius and a forest focus ring; yes / no / not sure as small segmented radios (full width on phones); inline errors in a dark rust tone (#8A2F1F) with aria-invalid; one forest submit button.
- **Panels:** visit panel white with a 1px border; mode tiles, empty states and the policy note on `--surface`. Only the floating hero card has a (small) shadow.

## Motion
Reviewed against Emil Kowalski's design-engineering rules (`emil-design-eng` skill). Transform and opacity only; one strong ease-out, `cubic-bezier(.23,1,.32,1)`; nothing over 300ms.
- **Press:** everything pressable scales to 0.97 on `:active` (0.98 for the large mode tiles), over 160ms.
- **Hover:** only on `(hover:hover) and (pointer:fine)`, as transitions (not keyframes) so skimming across controls retargets smoothly. Icons over 200ms: arrows nudge (up-right diagonally, right arrows 3px, back caret left), the compass and reset icons rotate 90°, the map and filter icons tilt 14°, mode and area icons lift 2px, hearts grow to 1.15. Card and carousel photographs scale to 1.025 over 300ms inside their rounded frames.
- **Page transitions:** native cross-document view transitions (`@view-transition{navigation:auto}`). The header (`site-header`) holds still. The old page fades out over 140ms, and the new one fades in and rises 8px over 280ms with the strong ease-out curve. Reduced motion keeps the fade without the rise. Browsers without support navigate normally. Links are prefetched on hover or focus (Astro `prefetchAll`, hover strategy), and Geist is preloaded, so the next page is usually ready before the click. `scrollbar-gutter: stable` stops pages of different heights shifting sideways. The navigation pill is placed without animation on load, so the active item doesn't flicker between pages.
- **Icon weight:** Phosphor **fill** for things: places, amenities, facts and the evidence-pill glyphs. **Outline** for functional icons that act or point: search, arrows, carets, plus and minus, close, filters, reset, copy and directions. `Icon` picks this by name unless a weight is passed. Hearts are the exception: they stay outlined (regular) until something is saved, on Save buttons, the Saved nav item when it isn’t the current page, and the empty Saved state.
- **Logo:** on the first page of a visit (sessionStorage flag set in `<head>` before paint), the nine letters rise from the baseline left to right, 640ms each with a 45ms stagger, clipped by the SVG box. On mouse hover, a 520ms wave runs across the letters (32ms stagger). `src/scripts/logo.ts` lets the wave finish and clears the intro so it never replays. Both are off under reduced motion.
- **Footer logo:** `logo.ts` arms it with the letters below the baseline. The first time the footer is 35% in view, they rise in turn: 900ms each, 70ms stagger. After that, each letter lifts 7% under a mouse pointer and settles back, as an interruptible transition. Hover uses the letter's bounding box where the browser supports it. The reveal is skipped under reduced motion or without JavaScript, so the logo simply shows.
- **Phone (under 640px):**
  - The main navigation becomes a floating bottom tab bar (icon over label, frosted surface, safe-area aware), and the header is one row: logo and Submit a place. The header gets `z-index:40` so the fixed bar stays above content, and `site-nav` has its own view-transition name.
  - Place cards become compact rows: a 96px square thumbnail with the name, type and area, the facts row and the Wi-Fi row beside it. The heart sits at the row's top right and the whole row is still one link. On the 53 places, this cut the Explore page from about 25,000px to about 8,600px at 390px.
  - Filter selects use 16px text so iOS doesn't zoom on focus.
- **Main navigation:** one white pill (`src/scripts/tabs.ts`) slides to the item under the mouse or keyboard focus over 280ms with the strong ease-out curve. It returns to the current page when the pointer or focus leaves. It fades in place, without sliding in from the edge, on pages outside the menu. Under reduced motion it only fades. Without JavaScript the current item paints its own white background.
- **Carousel:** a native scroll-snap track, so it swipes and works without JavaScript. Buttons scroll smoothly (instantly under reduced motion), the current dot widens from 6px to 18px over 200ms, and slides off screen are `inert`. It advances every 3 seconds. It pauses while hovered or focused and when the tab is hidden, and stops with the pause button. It does not autoplay under reduced motion.
- **Save:** the filled heart enters from scale 0.6 and opacity 0 via `@starting-style` (never from nothing), and a new save plays a one-off 360ms pulse (0.85 → 1.18 → 1).
- **Colour:** background, border and text colour fade over 160ms.
- **Reduced motion:** all movement goes (transform transitions, hover moves, press scale, the pulse); colour fades stay, because reduced motion means gentler, not none. Measured: 0 moving elements, 26 colour fades on Explore.
- No entrance animations, stagger, scroll hijack, parallax or autoplay. Keyboard actions never animate.

## Photography
Eight bundled Unsplash images, one per place, are stock photos, not venue photos (source IDs in SOURCES.md and the About page credits). At the owner's request (13 Nov 2026) the UI no longer shows a demo strip, photo tags or “does not depict” captions, so these images and the fictional fixtures must be replaced before any public launch. Replace with licensed real venue photographs before launch; preserve source, rights holder, permitted use and alt text. Card images are decorative links (the adjacent title is the accessible link); detail and hero images have meaningful alt text. Dimensions are reserved; the first row is eager-loaded and lower photos are lazy. No remote image dependency at runtime.

## Accessibility contract
Target WCAG 2.2 AA; this target requires manual assistive-technology validation, not merely a build.
- Landmarks, skip link, one h1, logical headings, active nav via aria-current, visible labels and native form controls.
- Search and selects work by keyboard. Search fields use a visually hidden label plus a visible icon, placeholder and Search button; selects keep visible labels inside their pills. Native radio group supports arrow keys. Filter toggle uses aria-expanded/controls and does not trap focus (it is an inline disclosure, not a modal).
- Save is a separate button, never nested in a card link. Use aria-pressed and action-specific accessible name. Live region announces save/remove and storage failure.
- Dynamic result count is polite. Empty-state action is reachable. Removing a focused saved card moves focus to the next save or empty-state link.
- Text ≥4.5:1 except qualifying large text ≥3:1; focus and interactive boundaries ≥3:1. Pairings must be rechecked after any token change.
- At 200% zoom/320px CSS viewport: no horizontal page scrolling, clipped actions or fixed overlays. All core information remains available.
- No colour-only statuses, tooltip-only evidence, hover-only controls or inaccessible custom dropdowns. Unknown access is never described as accessible.
- External Maps link announces new tab. No automatic geolocation request. Respect reduced motion.


---

# IA, page and component specifications
## Route and navigation map
| Route | Screen | Entry/exit | Indexing in starter |
|---|---|---|---|
| `/` | Discover | Main navigation, logo → search/modes/areas/details | noindex |
| `/explore/` | Explore | Discover, direct query URL → details | noindex |
| `/places/[slug]/` | Place details | Card/title → directions/save/Explore | noindex |
| `/saved/` | Saved | Main navigation → details/remove/Explore | noindex |
| `/submit/` | Submit a place, or report on one (`?place=<slug>`) | Header “Submit a place”; “Report what you found” on place details → back to the place or Explore | noindex |
| `/about/` | Trust and photo provenance | Footer, evidence explanation | noindex |
| `/404.html` | Unknown URL fallback | Host fallback → Explore | noindex |

Desktop and mobile show a segmented Discover / Explore / Saved navigation with icons and visible text labels (icons hide below 360px; labels never do). Place details is a destination within Explore, not a fourth primary tab: Explore stays marked as the current section there (`aria-current="true"`). Logo goes home. The header's right side links to Submit a place. Each place page has a “Been here recently?” panel linking to `/submit/?place=<slug>`, which prefills the place and retitles the page “Report on <name>.” The form has native labelled controls: place name, type, neighbourhood (with a datalist), yes / no / not sure radios for each amenity, the visit date (no future dates, Dubai time) and optional notes. Errors appear inline and are tied with aria-describedby and aria-invalid, and focus moves to the first invalid field. On success the form is replaced by a confirmation that takes focus, plus a “Your reports” list. Delivery is POST JSON to `PUBLIC_SUBMIT_ENDPOINT` when configured, otherwise local storage, and the confirmation copy states which happened. Submissions start as Reported. Detail breadcrumb returns to unfiltered Explore; browser Back restores the original filtered URL. No SPA router or view-transition persistence is required.

## URL contract
Explore accepts `q`, `category`, `neighbourhood`, `mode`, `wifi=true`, `power=true`. Example:
`/explore/?neighbourhood=JLT&mode=Focus&wifi=true`
Values are URL encoded. Default values are omitted. Invalid select/radio values fall back to all/any (an unknown `mode` keeps “Any” checked rather than leaving the group empty); unknown keys are dropped on next update. Search max length is 120 typed characters. Do not render URL values as HTML. Search submit and filter changes push history; Back/Forward restores controls and results. Search input typing alone does not update until submit (leaving the field does not push history either); select/radio/checkbox changes apply immediately. No debounced remote requests.

Matching: OR is implicit within the search corpus for each word, AND across words and all selected groups. Type/area/mode are single choice. Verified Wi-Fi/power require positive current verified evidence; a no answer is not a match. Results remain in JSON editorial order, with a computed count; all eight sample rows fit without paging. Pagination is out of scope until inventory grows.

## Discover
**Question:** Where could I work today?
**Order:** product navigation → tagline and concrete description → search pill → featured-places carousel: five listings, each a large photograph with a floating card (name, type and area, linking to details; no evidence pills), with previous / next, dot and pause/play controls, advancing every 3 seconds → four work intents with place counts → four starter listings → "Know a good spot?" forest field: invitation to submit a place (Submit a place, Browse places) beside three steps: add the place, say what you found, we check it → footer. The evidence states are explained on About.
Search uses native GET form to Explore so entry works even without client JavaScript. Area and mode shortcuts use real query links. Four featured cards are the first four data records, not ratings or algorithmic popularity. “Explore all” count derives from data.
Mobile composition puts the headline, search and area chips before the hero photo. No carousel; all four intents visible in a 2×2 grid. Full listing card image is not the sole way to open details.

## Explore
**Question:** Which places fit my plan and what do we know?
**Order:** centred title and description → search pill (with a Filters button below 1000px, on its own full-width row below 640px) → work-mode segmented control → select pills for place type and neighbourhood, Verified Wi-Fi / Verified power toggles, Clear all → live result count → listing grid or empty panel.
Filter disclosure appears below 1000px; its button reads “Filters · N active” while type, area or amenity filters are on, so a closed disclosure never hides why results are fewer. Areas are chosen with the Neighbourhood select only, so the header stays the same size as areas are added. From 768px up the search, modes and filter row are centred under the title. The rule for what passes “Verified” is explained on About and in the empty state, not under the filters. Closed by default with JS; controls remain visible without JS through CSS enhancement. Open state is inline, does not obscure results and has no focus trap. Desktop shows all filters. Clear all resets query, mode, type, area and both amenity filters; URL becomes `/explore/`. Zero results keeps the controls and explains the restrictive verified rules, with Clear filters action. Empty results are not an error.
All cards are pre-rendered for no-JS browsing. Search/filter enhancement requires JS; show a visible notice when disabled. No fake skeleton or spinner for synchronous local filtering.

## Place details
**Question:** Can I realistically work here, and what should I check first?
**Order:**
1. Breadcrumb (Explore, then the area when known).
2. Name, then type, area and "Visited by Elsewhere" with filled icons, and Save at the top right. Notes appear only when the list has some.
3. Photo with its "Temporary photo, not this place" caption, then three large stat tiles: Wi-Fi Mbps, sockets meter, noise.
4. Beside them, a sticky "Plan a visit" panel: entry, area (plus the list's location note), Wi-Fi access, hours ("Not added yet" when missing), links (website, menu), Directions or "Find on Google Maps" with its note, and the laptop tip.
5. "What we know": one row per known amenity (icon and label, evidence pill, note, source and date). The Wi-Fi row says what the speed is good for and when it needs a retest. Unknown amenities are collapsed into one dashed line, "Not added yet: …".
6. "Good for" work-mode chips with a caveat, then "Been here recently?", which asks for whatever is missing.

Below 768px: photo and tiles, then the panel, then the rest.
Each amenity row includes name, yes/no/unknown, derived evidence state, note, source and observation date. Use no place-wide verification badge. Stale records remain visible and fail verified filters. Show all five amenity rows even when unknown.
Price is clearly illustrative in demo and always includes currency/unit. No live opening status or booking action. A demo directions link opens only area-level Google Maps and explicitly says so. Production directions use validated coordinates preferentially, otherwise validated address. Never send fictional venue names to Maps as if they were a real destination.
Missing slug is 404, not the first listing. Long names wrap. Save works from both card and detail using the same ID.

## Saved
**Question:** Which places did I want to revisit?
Read browser-only saved IDs after script loads. Show only valid IDs; ignore deleted/unknown IDs. Initial no-JS view hides all cards rather than exposing the full catalogue as saved. Avoid a flash of all eight cards while loading by hiding results until hydration (implemented as enhancement in final starter).
Save removal immediately updates cards/count; move keyboard focus to the next saved item or empty action. Below the cards, “Compare evidence” is a table (place × five amenities) of the same evidence pills plus Wi-Fi speed and usual hours today, one row per saved place, hidden when nothing is saved; it scrolls inside its own focusable region on narrow screens. No bulk-clear button in MVP. First-use empty copy: “Your next workday starts here.” / “Save a few places to keep them here on this device.” / Explore places.
Storage failure: keep in-memory state for current page, announce failure and display limitation in Saved. No cross-device promise. Corrupt JSON/unsupported version yields an empty shortlist without crash. Cross-tab storage events update state; local-storage clear also clears Saved.

## Component contracts
| Component | Inputs | Outputs and semantics | States |
|---|---|---|---|
| Layout | title, description, slot | html lang, landmarks, nav, meta, footer (tagline, Find / Contribute / Elsewhere link columns in a labelled Footer nav, oversized wordmark, base row with the browser-local saves note and Back to top), script | current route, no-JS notice |
| SearchForm | query, action | labelled search input, submit GET or enhancement | empty, populated, submitted |
| WorkModeGroup | four enum modes, selected | native fieldset/legend/radio labels | any, single selected |
| FilterPanel | type/area/verified flags | native selects, checkboxes, reset | closed/open mobile, visible desktop |
| Listing | savedOnly boolean | SSR cards, count, filter form or saved list | all, filtered, zero, saved loading |
| PlaceCard | validated Place, priority, headingLevel | photo with Save heart; the title link is stretched so the whole card is one link; type and area; one row of filled-icon facts (Wi-Fi Mbps, sockets, noise; '–' when missing); a Wi-Fi row on every card showing the password with an icon-only Copy button, or else No password / Ask staff for the password / Sign-up page / Wi-Fi access not added | default, hover (photo scale, reduced-motion safe), focused, saved |
| EvidencePill | Evidence, placeId, amenity, compact? | label in `[data-evidence-label]` from `evidenceLabel`, `data-tone` from `evidenceTone`; tone glyph via CSS mask; `compact` leads with the amenity icon plus visually hidden amenity name; re-evaluated at visit time | positive, negative, caution, unknown |
| CompareTable | saved IDs | table of EvidencePills per saved place, plus Wi-Fi speed and usual hours today (Saved only) | hidden when empty |
| SaveButton | ID, place name, variant (icon/label) | button with heart icons, aria-pressed, action-specific aria-label, `.save-text` updated by app.ts; local storage mutation | hidden no-JS, unsaved, saved (filled heart, lime), new-save pulse, storage unavailable |
| EvidenceRow | Evidence and amenity label | state text, source/date, context note | unknown/reported/verified/stale/conflicting |
| VisitPanel | Place | spend/area/hours list, qualifier and Maps link | demo-area or real-destination |
| EmptyState | context, reset/explore action | heading and useful next action | no matches, no saves |
| LiveStatus | event text | polite role=status region | saved, removed, unavailable |
| Icon | Phosphor name, weight, size, anim | inline aria-hidden SVG read at build time from @phosphor-icons/core; optional hover animation (`nudge`, `slide`, `back`, `pop`, `spin`, `tilt`, `bob`) | static, hover (motion only when allowed) |

SearchForm, FilterPanel, EvidenceRow and EmptyState are documented logical boundaries currently inline in pages/components; split them when adding real editorial data or a second use, not preemptively into a framework dependency.

## Interaction and failure details
- No network for core interaction after load. Images have dimensions and ground fallback; broken images do not remove titles or practical facts.
- No network submission, sign-in or contact form is implied. Do not add report-an-issue buttons without a working destination and handling policy.
- Saves key: `elsewhere:saved:v1`; value `{ "version": 1, "ids": ["demo-01"] }`; unique IDs, catalogue validation. Storing an unknown ID is ignored on read. Do not store full venue objects or personal details.
- `localStorage` read/write errors are caught. A probe detects blocked writes. On failure, in-memory saves survive only the current page. Announce that limitation on every attempted save.
- Staleness is computed both during static render and at browser visit, so a long-lived static build does not retain a stale positive filter match. Without JS, static evidence ages at build time; rebuild daily in production or add server-rendered freshness before relying on no-JS current evidence.
- If a future data backend fails, preserve cached data with date and inline Retry; never silently substitute fixtures. That backend is not implemented here.


---

# Data model and verification policy
## Source of truth
`src/lib/schema.ts` defines Zod validation and inferred TypeScript types. `src/data/places.json` is the actual fixture dataset. `src/lib/places.ts` validates at import/build and checks ID/slug uniqueness. Data does not need an API. Optional future database tables are described below; they are not required to run.

## Place contract
| Field | Type | Rules |
|---|---|---|
| id | stable string | Required, unique, immutable across name changes |
| slug | lowercase URL string | Required, unique; changing needs redirect |
| name | string | Required, user-facing; never interpreted as HTML |
| isSample | boolean | True for every fixture; keep labels for all sample records |
| category | enum | Café / Co-working / Restaurant / Hotel lounge |
| neighbourhood | string | Controlled editorial spelling; fixture areas are real Dubai area names |
| summary | string | Practical description, no unsupported superlatives |
| image, imageAlt, imageCredit | strings | Local source, meaningful alt, attribution/provenance |
| modes | enum array | Focus / Casual / Meetings / Together; editorial fit only |
| priceNote | string | Currency, range, unit and qualifiers visible |
| hoursNote | string | Human-readable qualifier shown with the hours (or instead of them when `hours` is null) |
| policyNote | string | Laptop windows, purchase/booking requirements if sourced |
| address | string or null | Null for all sample venues |
| coordinates | `{lat,lng}` or null | Valid latitude/longitude ranges, null for all fixtures |
| website | URL or null | Null for all fixtures; shown only when set, opening in a new tab |
| amenities | object | All five evidence records required |
| wifiSpeed | `{downMbps, upMbps or null, measuredAt, source}` or null | One dated speed test. Older than 90 days or future-dated reads “needs retest”. Not allowed when Wi-Fi is “no” |
| wifiAccess | `{value: open/password/signup/unknown, password or null, source, checkedAt}` | Known values need a source and date. `password` only when the value is `password`. It's shown with Copy and its listed date, since passwords change |
| hours | `{source, checkedAt, week: {mon…sun: [open, close] or null}}` or null | Usual hours in 24-hour Dubai time; a close at or before the open runs past midnight; equal times mean 24 hours; null day = closed |

Fixture amenities: wifi, power, laptops, calls, stepFree. Wi-Fi speed, Wi-Fi access and usual hours are separate dated records (above), never inferred from the Wi-Fi evidence. Toilets, parking, noise, prayer space, outdoor seating, accessibility beyond step-free entry, and sockets per table are **not inferred**. Add separately verified fields if introduced.

## Evidence contract
```
{
  "value": "yes | no | unknown",
  "status": "unknown | reported | verified | conflicting",
  "source": "editorial source reference or null",
  "checkedAt": "UTC ISO-8601 timestamp or null",
  "note": "scope, limitations and relevant context"
}
```
`stale` is derived, never stored. Verified requires a known yes/no value, source and date. Unknown status requires unknown value. A conflicting record should use unknown value because sources disagree; UI still says Conflicting reports. Starter schema enforces minimum verified/unknown invariants; production editorial review must enforce all governance rules and source adequacy.

## State and display table
| Stored situation | Display | Positive amenity filter |
|---|---|---|
| unknown / unknown | Not checked | Exclude |
| reported / yes | Yes · Reported | Exclude |
| reported / no | No · Reported | Exclude |
| verified / yes, ≤90 days | Yes · Verified | Include |
| verified / no, ≤90 days | No · Verified | Exclude |
| verified / yes or no, >90 days | Yes/No · Needs recheck | Exclude |
| verified with future timestamp | Yes/No · Needs recheck | Exclude; investigate bad clock/data |
| conflicting | Conflicting reports | Exclude |

Exactly 90 days old remains current; one millisecond older becomes stale. Clock is injectable in tests. Date aging is UTC elapsed duration; display is Asia/Dubai. The verified filter evaluates each selected amenity independently and requires all selected flags. Even a reported “yes” from venue staff is not an independent visit verification.

## Editorial procedure for real venues
1. Create draft with real identity, category, area and nullable address/coordinates. Keep all amenities unknown until evidence exists. Confirm the venue permits listing and that available imagery is licensed for the intended use.
2. Record source for each claim: venue page with URL/access date, direct dated staff confirmation, or dated editorial observation with observer reference and time/context. Keep staff personal details private.
3. Venue statements and community submissions become Reported. Independent editor observation may become Verified when it directly establishes the fact. A speed test must include measured Mbps, time, device/context and method in a future separate schema; Wi-Fi yes alone cannot imply speed.
4. Record limitations: sockets in one seating zone, laptops weekdays only, calls outside, meal service exclusions, minimum spend. A visit at 10am does not justify “quiet all day”.
5. Have a second editor review positive laptop policy, access claims and directions target. For step-free entry, inspect the entire approach/entrance route; do not describe full wheelchair accessibility from that field alone.
6. Publish only approved records, rebuild static site and verify links. Set recheck deadline. Run a daily freshness/build job in a future production workflow; the starter includes none.
7. When credible contradictory evidence arrives, mark Conflicting immediately, suppress positive matching, review both sources, resolve with new evidence and retain a private audit trail.
8. When evidence expires, render Needs recheck automatically. Reverify with a fresh source/date; never update a timestamp without a new check.

Proposed production extension: add `modeEvidence[]` with mode, reason, editorRef, observedAt; media rights fields (sourceUrl, rightsHolder, license, approvalAt); structured price ranges (currency AED, unit, min/max, source/date); multiple evidence sources and private audit log. The starter's single source string is intentionally lightweight and is not a production evidence management system.

## Optional relational mapping
- places: id PK, slug unique, name, category, neighbourhood, address, lat/lng, status draft/published/archived, updated_at.
- amenity_observations: id PK, place_id FK, amenity_key, value, evidence_state, observed_at, source_id, note, editor_id. Keep history, derive latest approved effective observation.
- sources: id PK, method, URL/private reference, captured_at, approved_by.
- place_modes: place_id, mode, reason, observed_at, editor_id.
- media: id, place_id, path, alt, source_url, rights_holder, license, approved_at.
Saved places remain client-only in MVP; no users table is needed.

## Place inventory
53 places from the owner's Notion database “WFH in Dubai” (collection dbf937f7…), imported 13 Nov 2026 by a one-off converter. Mapping:
- **Name, website, menu link, Google Maps link** are copied. A plain-text “Directions” value becomes `locationNote`.
- **Tags** (Cafe, Co-working, Restaurant, Bar) become `tags`, and the first tag becomes `category`. Untagged places show “Type not added”.
- **Speed (Mbps)** becomes `wifiSpeed`, dated to when the entry was added. **Password** becomes `wifiAccess`: “No password” is open, “Sign up” is sign-up, “Ask server” is a password from staff with none listed, and any other value is the guest password itself (`wifiAccess.password`, 13 places). It's shown on cards and the place page with a Copy button and the month it was listed.
- **Sockets** (⚡ count, 1–5) become `sockets` and Reported power evidence. **Noise level** becomes `noise` and Reported calls evidence (loud is a reported “no”). **Entry type** becomes `entry`. **Visited** becomes `visited` and source “Elsewhere visit”; otherwise the source is “Elsewhere list”.
- **Area** is set only where the list names it (title, directions, notes or website): 24 of 53. Everything else reads “Area not added”.
- **Laptop policy, step-free access and hours** are not in the list, so they stay unknown. Work modes are derived from noise and co-working tags as suggestions.
- **Photos:** temporary stock photos (scene-1 to scene-8) are assigned by type in rotation. Alt text and credit say “not this venue”, and the place page captions each one.

## Wi-Fi details and usual hours
- **Speed** is a snapshot from one test, shown with its tester and date and a plain tier: 50+ Mbps “Plenty for video calls”, 20+ “Good for video calls”, 5+ “Fine for email and browsing”, otherwise “Slow for most work”. A speed never upgrades the Wi-Fi evidence and does not count towards the Verified Wi-Fi filter.
- **Access** says how to get on (no password, password from staff, sign-up page). Publishing passwords is out of scope: they change, and venues may not want them shared. The report form asks visitors not to include them, and the payload has no password field.
- **Hours** are usual hours as checked, with a source and date. The UI says “Usually 8 am – 5 pm today” or “Usually closed today”, with today worked out in Dubai time when the page is read, and never “open now”. The visit panel adds that public holidays and Ramadan hours may differ, and still tells visitors to check with the venue.


---

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



---

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


---

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


---

# Sources and asset provenance
Checked 3 November 2026. Primary sources inform installation and stack guidance; they do not certify any Dubai venue.

- Taste Skill installation and v2 status: https://www.tasteskill.dev/docs
- Taste Skill repository: https://github.com/Leonxlnx/taste-skill
- Official OpenAI skills guide (current redirect from Codex skills docs): https://learn.chatgpt.com/docs/build-skills
- Astro styles and Tailwind integration: https://docs.astro.build/en/guides/styling/
- Unsplash license: https://unsplash.com/license (permits download and commercial/noncommercial use with listed restrictions; stock images are not venue endorsements).

## Bundled photographs
Files were downloaded from the following Unsplash image endpoints, resized to 1200px and JPEG quality 80. These are illustrative stock scenes; no claim is made about where they were photographed. Original photographer names were not confirmed, so no attribution names are invented. The source IDs are preserved for provenance; review image rights/subjects again when choosing production imagery.

| Local file | Source |
|---|---|
| public/images/scene-1.jpg | https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80&fit=crop |
| public/images/scene-2.jpg | https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&q=80&fit=crop |
| public/images/scene-3.jpg | https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80&fit=crop |
| public/images/scene-4.jpg | https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80&fit=crop |
| public/images/scene-5.jpg | https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1200&q=80&fit=crop&fm=jpg (added 13 Nov 2026) |
| public/images/scene-6.jpg | https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&q=80&fit=crop&fm=jpg (added 13 Nov 2026; re-encoded at JPEG quality 55) |
| public/images/scene-7.jpg | https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=80&fit=crop&fm=jpg (added 13 Nov 2026) |
| public/images/scene-8.jpg | https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1200&q=80&fit=crop&fm=jpg (added 13 Nov 2026; re-encoded at JPEG quality 55) |

Scenes 5–8 were added so that each of the eight fictional places has its own illustrative photo. They were chosen from a contact sheet because none shows an identifiable face or legible venue branding. The same provenance caveats apply: the photographer names were not confirmed, so none is invented.

Icons are [Phosphor](https://phosphoricons.com) via `@phosphor-icons/core` 2.1.1 (MIT), inlined into the built HTML; keep its license with redistributed builds. Geist is installed from `@fontsource-variable/geist`; retain upstream font license and package metadata when distributing compiled assets. npm dependencies retain their respective licenses. No Mobbin, on.design or Ruma screenshots, layouts or assets are copied; the owner-supplied screenshots of those products were used as visual inspiration only.

## Design process record
The installed local Taste Skill selected `editorial-greeting`, seed 1958382861. The generated direction record is included in `.taste-skill/`. The user-requested palette/type were kept. A simpler top navigation, larger Discover headline and photo listings intentionally adapt the workspace-oriented draw to a consumer city guide. No delegation was requested or used.

## Place data (from 13 Nov 2026)
The places are the owner's own Notion database “WFH in Dubai”. Each fact is dated to when its entry was added (Aug 2020 to Jan 2023). The scene photographs above are used as **temporary** photos for the places, chosen by type, at the owner’s request. They show other venues; alt text, credits and a caption on each place page say so. Replace them with licensed photos of each venue before launch.


---

# Appendix · Portable design tokens (docs/tokens.json)

```json
{
  "color": {
    "paper": "#F7F6F2",
    "ink": "#20231F",
    "forest": "#285943",
    "lime": "#DCE9B5",
    "surface": "#EDECE5",
    "muted": "#585E54",
    "border": "#DEDDD3",
    "control": "#767E70",
    "surface2": "#E4E3DA",
    "raised": "#FFFFFF",
    "caution": "#F0E9D6",
    "negative": "#E4E5DC"
  },
  "font": {
    "family": "Geist Variable, system-ui, sans-serif",
    "weights": [
      400,
      500,
      550,
      600,
      650
    ],
    "bodyPx": 16,
    "metaPx": 13
  },
  "spacingPx": [
    4,
    8,
    12,
    16,
    20,
    24,
    28,
    32,
    40,
    48,
    56,
    64
  ],
  "radiusPx": {
    "photo": 20,
    "panel": 24,
    "control": "pill (999)",
    "photoTag": "pill (999)"
  },
  "layout": {
    "maxWidthPx": 1320,
    "desktopGutterPx": 32,
    "mobileGutterPx": 16,
    "tabletStartPx": 640,
    "desktopStartPx": 1000,
    "listingGapPx": 20
  },
  "motion": {
    "feedbackMs": 160,
    "iconMs": 280,
    "photoHoverMs": 700,
    "easing": "cubic-bezier(.2,.8,.2,1)",
    "photoHoverScale": 1.035,
    "reducedMotion": "none"
  },
  "verification": {
    "staleAfterDays": 90,
    "timezone": "Asia/Dubai"
  },
  "icons": {
    "set": "Phosphor (@phosphor-icons/core, MIT)",
    "delivery": "inlined SVG at build time",
    "weights": [
      "regular",
      "fill",
      "bold (evidence glyph masks)"
    ]
  }
}
```
