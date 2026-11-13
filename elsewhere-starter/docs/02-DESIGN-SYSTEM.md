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
