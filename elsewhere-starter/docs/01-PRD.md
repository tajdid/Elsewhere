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
