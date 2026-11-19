# IA, page and component specifications
## Route and navigation map
| Route | Screen | Entry/exit | Indexing in starter |
|---|---|---|---|
| `/` | Discover | Main navigation, logo → search/modes/areas/details | noindex |
| `/explore/` | Explore | Discover, direct query URL → details | noindex |
| `/places/[slug]/` | Place details | Card/title → directions/save/Explore | noindex |
| `/saved/` | Saved | Main navigation → details/remove/Explore | noindex |
| `/submit/` | Submit a place, or report on one (`?place=<slug>`) | Header “Submit a place”; “Report what you found” on place details → back to the place or Explore | noindex |
| `/404.html` | Unknown URL fallback | Host fallback → Explore | noindex |
| `/dubai/[area]/` | Neighbourhood guide (areas with ≥3 places: Palm Jumeirah, Dubai Marina, JLT, JVC) | Discover “Where to work in Dubai”, place breadcrumb, “More places in …” → places | indexable at launch |
| `/collections/[slug]/` | Collection guide (fast Wi-Fi, plenty of sockets, okay for calls; ≥5 places each) | Discover guides, place “In these guides” → places | indexable at launch |
| `/sitemap.xml`, `/robots.txt` | Generated endpoints | — | — |

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
**Order:** centred title and description → search pill (with a Filters button below 1000px, on its own full-width row below 640px) → work-mode segmented control → select pills for place type and neighbourhood (sized to their value), Fast Wi-Fi / Plenty of sockets / Okay for calls toggles (same names as the collection pages), Clear all (shown only while something is set; if it had focus, focus moves to the search box) → ruled line → live result count → listing grid or empty panel.
Filter disclosure appears below 1000px; its button reads “Filters · N active” while type, area or amenity filters are on, so a closed disclosure never hides why results are fewer. Areas are chosen with the Neighbourhood select only, so the header stays the same size as areas are added. From 768px up the search, modes and filter row are centred under the title. The rule for what passes “Verified” is explained on About and in the empty state, not under the filters. Closed by default with JS; controls remain visible without JS through CSS enhancement. Open state is inline, does not obscure results and has no focus trap. Desktop shows all filters. Clear all resets query, mode, type, area and the three fact filters; URL becomes `/explore/`. Zero results keeps the controls and explains the restrictive verified rules, with Clear filters action. Empty results are not an error.
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
| Layout | title, description, slot | html lang, landmarks, nav, meta, footer (tagline and Submit a place, the oversized wordmark, and a base row with the browser-local saves note and Back to top), script | current route, no-JS notice |
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

## Site metadata
Every page (Layout) has:
- **Title:** `<title>` set to “Page · Elsewhere”; the home page uses “Elsewhere · Work from somewhere new”.
- **Description:** the page's own meta description.
- **Canonical URL:** built from `site` in astro.config.mjs (https://elsewhere.work).
- **Social cards:** Open Graph (`og:type`, `site_name`, `locale` en_GB, `title`, `description`, `url`, and the 1200×630 image `/og.png` with alt text) and Twitter `summary_large_image`.
- **Structured data:** a JSON-LD `WebSite`.
- **Icons and app:** `favicon.svg` (the logo's E on forest), `apple-touch-icon.png` (180), and `site.webmanifest` with 192 and 512 icons (the 512 is maskable-safe). Also `application-name`, `apple-mobile-web-app-title`, `theme-color` and `color-scheme: light`.
- **Search engines:** `robots.txt` allows crawling so crawlers can read each page's `noindex,nofollow`, which stays until launch.

Place pages use the site image rather than their temporary photos, which don't show the venue.


## About and footer (14 Nov 2026)
- **`/about/`:** what Elsewhere is, with three figures counted from the data. "Who's behind it" credits Tajdid Rahman (tajdidrahman.co.uk). "What things mean" covers Wi-Fi speed tiers, the sockets scale, noise, Wi-Fi access, Visited and Not added. "The labels on each place" covers the evidence pills, and "Good to know" covers temporary photos, local saves, changing hours and directions.
- **Footer:** tagline and description, Explore / Saved / About links, Submit a place, the big wordmark, then “Made with ☕ by Tajdid Rahman” (a coffee icon, with a link opening tajdidrahman.co.uk in a new tab) and Back to top.
- **Place page:** the laptop tip sits in the left column under “What we know”, as a callout reading “Laptops: …”.

## Search and answer engines (18 Nov 2026)
- **Indexing switch.** Every page stays `noindex,nofollow` until the production build sets `PUBLIC_ALLOW_INDEXING=true` (Vercel previews never index). Then Saved, Submit, 404 and thin place pages (fewer than two of: Wi-Fi speed, sockets, noise, Wi-Fi access, a note) are `noindex,follow`; everything else is `index,follow`.
- **Canonical base.** `PUBLIC_SITE_URL`, else Vercel's `VERCEL_PROJECT_PRODUCTION_URL`, else `https://elsewhere-silk.vercel.app`. Canonicals drop query strings, so filtered Explore URLs consolidate to `/explore/`.
- **Sitemap.** Home, Explore, About, neighbourhood and collection guides, indexable place pages. No `<lastmod>`: the list's dates describe the venue facts, not page changes. robots.txt names the sitemap only when indexing is on.
- **Titles.** Home “Best cafés to work from in Dubai | Elsewhere”; places “{Name} – {Type} in {Area}, Dubai | Elsewhere” (≤70 characters); guides use their H1.
- **Place pages** add a quick verdict (built from noise, Wi-Fi speed, sockets and access; names what’s missing; always says when it was added and that it hasn’t been rechecked), the owner’s note as “From the list”, “Quick answers” (only questions the data can answer), “In these guides” and “More places in {area}”.
- **Guides** open with an answer built from the listed facts, show the inclusion rule and dates, a server-rendered comparison table, the cards, and links to the other guides. Thresholds: `MIN_AREA_PLACES`, `MIN_COLLECTION_PLACES` in `src/lib/seo.ts`.
- **JSON-LD.** Home: WebSite + Organization (no social profiles exist). Explore and guides: CollectionPage + ItemList + BreadcrumbList. Places: WebPage + CafeOrCoffeeShop/Restaurant/BarOrPub/LocalBusiness with locality, neighbourhood → Dubai, Wi-Fi/power features, free entry, website and Maps link where listed. No street address, geo, hours, image (photos are stand-ins) or ratings. About: AboutPage.
- **About** gains “How the list is made”: how places are chosen, where details come from, what Verified means (nothing is yet), how updates keep dates honest, and corrections.
