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
- Sample directions use neighbourhood names and are labelled accordingly. Real venue directions require validated address or coordinates.
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
| Surface | `--surface` | #EDECE5 | One tone step: segmented tracks, mode tiles, demo strip, footer, empty states |
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
- Wordmark: 27px (25px phone), 650, -0.06em, with a forest arrow-up-right. Footer repeats it at 48–96px.
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
- **Cards:** no box. Rounded 20px photo with a "Sample · illustrative photo" tag and a round 44px heart Save button; below, the title link, category and area with icons, the summary, and two compact evidence chips (amenity icon + state words; the amenity name is in visually hidden text and a `title`).
- **Evidence pills:** 26px, 13px/500, fully rounded. Positive (current verified yes) = lime + check; negative (verified no) = neutral + x; caution (reported, conflicting, needs recheck) = sand + warning; unknown (not checked) = transparent with an inset outline + minus. Tone comes from `evidenceTone()`; the words always carry the meaning.
- **Save:** heart outline → filled forest heart on lime; the label variant on details reads "Save"/"Saved". `aria-pressed` plus an action-specific `aria-label`.
- **Panels:** visit panel white with a 1px border; mode tiles, empty states and the policy note on `--surface`. Only the floating hero card has a (small) shadow.

## Motion
Reviewed against Emil Kowalski's design-engineering rules (`emil-design-eng` skill). Transform and opacity only; one strong ease-out, `cubic-bezier(.23,1,.32,1)`; nothing over 300ms.
- **Press:** everything pressable scales to 0.97 on `:active` (0.98 for the large mode tiles), over 160ms.
- **Hover:** only on `(hover:hover) and (pointer:fine)`, as transitions (not keyframes) so skimming across controls retargets smoothly. Icons over 200ms: arrows nudge (up-right diagonally, right arrows 3px, back caret left), the compass and reset icons rotate 90°, the map and filter icons tilt 14°, mode and area icons lift 2px, hearts grow to 1.15. Card and hero photographs scale to 1.025 over 300ms inside their rounded frames.
- **Save:** the filled heart enters from scale 0.6 and opacity 0 via `@starting-style` (never from nothing), and a new save plays a one-off 360ms pulse (0.85 → 1.18 → 1).
- **Colour:** background, border and text colour fade over 160ms.
- **Reduced motion:** all movement goes (transform transitions, hover moves, press scale, the pulse); colour fades stay, because reduced motion means gentler, not none. Measured: 0 moving elements, 26 colour fades on Explore.
- No entrance animations, stagger, scroll hijack, parallax or autoplay. Keyboard actions never animate.

## Photography
Eight bundled Unsplash images, one per fictional place, are illustrative only (source IDs in SOURCES.md and on the About page). They must not be treated as Dubai venue photos. Keep the persistent demo strip, the photo tags and the captions. Replace with licensed real venue photographs before launch; preserve source, rights holder, permitted use and alt text. Card images are decorative links (the adjacent title is the accessible link); detail and hero images have meaningful alt text. Dimensions are reserved; the first row is eager-loaded and lower photos are lazy. No remote image dependency at runtime.

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
| `/submit/` | Submit a place: what a submission needs and how it is treated | Header “Submit a place” link → About | noindex |
| `/about/` | Trust and photo provenance | Footer, evidence explanation | noindex |
| `/404.html` | Unknown URL fallback | Host fallback → Explore | noindex |

Desktop and mobile show a segmented Discover / Explore / Saved navigation with icons and visible text labels (icons hide below 360px; labels never do). Place details is a destination within Explore, not a fourth primary tab: Explore stays marked as the current section there (`aria-current="true"`). Logo goes home. The header's right side links to Submit a place. That page has no form: the demo has no backend or inbox, so it states plainly that submissions are not open and nothing is sent, lists what a submission would need (the place, per-amenity observations, the visit time, rights-cleared photos), and explains that submissions start as Reported. Detail breadcrumb returns to unfiltered Explore; browser Back restores the original filtered URL. No SPA router or view-transition persistence is required.

## URL contract
Explore accepts `q`, `category`, `neighbourhood`, `mode`, `wifi=true`, `power=true`. Example:
`/explore/?neighbourhood=JLT&mode=Focus&wifi=true`
Values are URL encoded. Default values are omitted. Invalid select/radio values fall back to all/any (an unknown `mode` keeps “Any” checked rather than leaving the group empty); unknown keys are dropped on next update. Search max length is 120 typed characters. Do not render URL values as HTML. Search submit and filter changes push history; Back/Forward restores controls and results. Search input typing alone does not update until submit (leaving the field does not push history either); select/radio/checkbox changes apply immediately. No debounced remote requests.

Matching: OR is implicit within the search corpus for each word, AND across words and all selected groups. Type/area/mode are single choice. Verified Wi-Fi/power require positive current verified evidence; a no answer is not a match. Results remain in JSON editorial order, with a computed count; all eight sample rows fit without paging. Pagination is out of scope until inventory grows.

## Discover
**Question:** Where could I work today?
**Order:** fictional-content strip → product navigation → tagline and concrete description → search pill → area chips (JVC, JLT, Dubai Marina, Business Bay) → three figures counted from the data (sample places, neighbourhoods, amenities per place) → large illustrative photograph with a floating sample-listing card (The Long Table Works, its Wi-Fi and power evidence, a link to details) → four work intents with place counts → four starter listings → evidence explanation with the pill legend on a forest field → footer.
Search uses native GET form to Explore so entry works even without client JavaScript. Area and mode shortcuts use real query links. Four featured cards are the first four data records, not ratings or algorithmic popularity. “Explore all” count derives from data.
Mobile composition puts the headline, search and area chips before the hero photo. No carousel; all four intents visible in a 2×2 grid. Full listing card image is not the sole way to open details.

## Explore
**Question:** Which places fit my plan and what do we know?
**Order:** title → search pill (with a Filters button below 1000px) → work-mode segmented control → select pills for place type and neighbourhood, Verified Wi-Fi / Verified power toggles, Clear all, and a note on what passes “Verified” → live result count → listing grid or empty panel.
Filter disclosure appears below 1000px; its button reads “Filters · N active” while type, area or amenity filters are on, so a closed disclosure never hides why results are fewer. A short note under the amenity checkboxes says which evidence passes “Verified”. Closed by default with JS; controls remain visible without JS through CSS enhancement. Open state is inline, does not obscure results and has no focus trap. Desktop shows all filters. Clear all resets query, mode, type, area and both amenity filters; URL becomes `/explore/`. Zero results keeps the controls and explains the restrictive verified rules, with Clear filters action. Empty results are not an error.
All cards are pre-rendered for no-JS browsing. Search/filter enhancement requires JS; show a visible notice when disabled. No fake skeleton or spinner for synchronous local filtering.

## Place details
**Question:** Can I realistically work here, and what should I check first?
**Order:** breadcrumb (Explore / area, both links) → identity/type/area/sample label and Save → illustrative photo and caption beside the sticky plan-visit panel (spend, area, hours, qualifier, neighbourhood directions) → evidence rows with pills → link to the evidence legend → work-mode links → policy → footer. Below 768px: photo → visit panel → evidence.
Each amenity row includes name, yes/no/unknown, derived evidence state, note, source and observation date. Use no place-wide verification badge. Stale records remain visible and fail verified filters. Show all five amenity rows even when unknown.
Price is clearly illustrative in demo and always includes currency/unit. No live opening status or booking action. A demo directions link opens only area-level Google Maps and explicitly says so. Production directions use validated coordinates preferentially, otherwise validated address. Never send fictional venue names to Maps as if they were a real destination.
Missing slug is 404, not the first listing. Long names wrap. Save works from both card and detail using the same ID.

## Saved
**Question:** Which places did I want to revisit?
Read browser-only saved IDs after script loads. Show only valid IDs; ignore deleted/unknown IDs. Initial no-JS view hides all cards rather than exposing the full catalogue as saved. Avoid a flash of all eight cards while loading by hiding results until hydration (implemented as enhancement in final starter).
Save removal immediately updates cards/count; move keyboard focus to the next saved item or empty action. Below the cards, “Compare evidence” is a table (place × five amenities) of the same evidence pills, one row per saved place, hidden when nothing is saved; it scrolls inside its own focusable region on narrow screens. No bulk-clear button in MVP. First-use empty copy: “Your next workday starts here.” / “Save a few places to keep them here on this device.” / Explore places.
Storage failure: keep in-memory state for current page, announce failure and display limitation in Saved. No cross-device promise. Corrupt JSON/unsupported version yields an empty shortlist without crash. Cross-tab storage events update state; local-storage clear also clears Saved.

## Component contracts
| Component | Inputs | Outputs and semantics | States |
|---|---|---|---|
| Layout | title, description, slot | html lang, landmarks, nav, meta, footer, script | current route, no-JS notice |
| SearchForm | query, action | labelled search input, submit GET or enhancement | empty, populated, submitted |
| WorkModeGroup | four enum modes, selected | native fieldset/legend/radio labels | any, single selected |
| FilterPanel | type/area/verified flags | native selects, checkboxes, reset | closed/open mobile, visible desktop |
| Listing | savedOnly boolean | SSR cards, count, filter form or saved list | all, filtered, zero, saved loading |
| PlaceCard | validated Place, priority, headingLevel | rounded photo with sample tag and heart Save, title link (h2 on Explore/Saved, h3 on Discover), category and area with icons, summary, compact Wi-Fi and power evidence chips | default, hover (photo scale, reduced-motion safe), focused, saved |
| EvidencePill | Evidence, placeId, amenity, compact? | label in `[data-evidence-label]` from `evidenceLabel`, `data-tone` from `evidenceTone`; tone glyph via CSS mask; `compact` leads with the amenity icon plus visually hidden amenity name; re-evaluated at visit time | positive, negative, caution, unknown |
| CompareTable | saved IDs | table of EvidencePills per saved place (Saved only) | hidden when empty |
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
| hoursNote | string | Human-readable uncertainty; not machine opening hours |
| policyNote | string | Laptop windows, purchase/booking requirements if sourced |
| address | string or null | Null for all sample venues |
| coordinates | `{lat,lng}` or null | Valid latitude/longitude ranges, null for all fixtures |
| amenities | object | All five evidence records required |

Fixture amenities: wifi, power, laptops, calls, stepFree. Wi-Fi speed, toilets, parking, noise, prayer space, outdoor seating, accessibility beyond step-free entry, and sockets per table are **not inferred**. Add separately verified fields if introduced.

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

## Fixture inventory
All names below are invented concepts even if coincidental real-world name similarities exist. No assertions are made about similarly named businesses.
| ID | Fictional concept | Actual area label | Scenario |
|---|---|---|---|
| demo-01 | Palm & Paper Studio | JVC | Verified negative Wi-Fi, mixed evidence |
| demo-02 | Canal Reading Room | Business Bay | Reported Wi-Fi, current positive calls |
| demo-03 | The Long Table Works | JLT | Unknown Wi-Fi, mixed current evidence |
| demo-04 | Terrace Eight Kitchen | Dubai Marina | Current positive Wi-Fi and conflicting power |
| demo-05 | Sikka Study Club | Al Quoz | Conflicting Wi-Fi, expired verification records |
| demo-06 | Creekside Common Room | Al Jaddaf | Current positive Wi-Fi and reported power |
| demo-07 | Neighbourhood Desk House | JVC | Reported Wi-Fi and unknown power |
| demo-08 | Juniper Lunch Room | JLT | Unknown Wi-Fi and current positive power |

The eight entries cover four categories, six neighbourhoods and four modes. All address/coordinate fields are null; prices are illustrative AED ranges; hours are unknown. See JSON for exact timestamps and individual amenity values. Do not convert fixtures into real venues by merely removing sample labels.


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
| AC21 | P0 | Given all screens, fictional label, photo disclaimer, pricing qualifier remain visible; no real venue claims, fake reviews or ratings. | editorial |
| AC22 | P0 | Given dependency lock and clean install, tests and Astro check/build pass; static pages emit all eight slugs. | automated |
| AC25 | P0 | Given any card, detail row or comparison cell, each amenity's evidence shows as words plus a tone; only a current verified yes uses the positive (lime) tone, and stale, reported, conflicting, verified-no and unknown never do. | unit + browser |
| AC26 | P0 | Given an Explore URL with an unknown mode or type, the controls fall back to Any/All; on a narrow screen the closed Filters button states how many hidden filters are active. | browser |
| AC27 | P0 | Given saved places, Saved shows a comparison table with one row per saved place and five evidence cells; removing the last save hides the table and shows the empty state. | browser |
| AC23 | Launch | Given real assets/content, evidence review, rights, brand/domain checks, HTTPS, host 404 and metadata pass before public indexing. | owner sign-off |
| AC24 | Launch | Given mobile lab tests and then field data, performance meets PRD targets or variance is documented with remediation. | Lighthouse + field |

## Test commands
`npm test` runs the data/logic contracts with an injected verification clock. `npm run build` runs strict Astro/TypeScript diagnostics then emits static output. `npm run test:e2e` uses a local dev server and Chromium; install browser via Playwright first. Browser fixture tests freeze only evidence evaluation where needed through date-specific unit tests; UI expectations avoid assuming today's verification stays current indefinitely.

## Manual test script
1. New browser/profile, no saved IDs. Inspect banner; enter JLT; choose Focus; open The Long Table Works; read laptop evidence.
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
    lib/schema.ts / places.ts / discovery.ts / icons.ts (build-time Phosphor reader) / ui.ts (icon mappings)
    pages/index.astro / explore.astro / saved.astro / about.astro / 404.astro
    pages/places/[slug].astro
    scripts/app.ts
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
