# Design system and tokens
## Direction
A useful city guide with editorial hierarchy: photography invites a closer look; practical evidence supports the decision. Mobbin is a reference for clarity and density, not a copied screen or asset library. Taste Skill informs composition and review. The explicit brand takes priority over skill defaults.

Taste draw: `editorial-greeting`, seed 1958382861, light, workspace. Chosen for a centred column and calm tonal structure. Adaptations: three labelled destinations use a top navigation rather than the dealt sidebar; the discovery intro uses the requested tagline instead of a personal greeting; photography replaces irrelevant workspace metrics. App title-size and accent-budget rules are relaxed on Discover to support the user's editorial brand. No invented KPIs or decorative chart panels. No redraws.

Signature element: work intent → visible amenity evidence. The product face comes from warm paper, restrained forest green, the Elsewhere outward arrow, local area names and photograph-led choices. The arrow is a navigation gesture, not a trademark-cleared logo.

## Semantic palette
| Role | Token | Value | Usage |
|---|---|---|---|
| Paper | `--ground` / `--color-paper` | #F7F6F2 | Page and control ground |
| Ink | `--text` / `--color-ink` | #20231F | Titles and primary copy |
| Forest | `--accent` / `--color-forest` | #285943 | Main action, focus and evidence text |
| Lime | `--signal` / `--color-lime` | #DCE9B5 | Saved state, never small text on paper |
| Muted | `--muted` | #585E54 | Secondary copy and metadata |
| Surface | `--surface` | #EEEEE7 | Work-mode panels, empty state, visit block |
| Structural border | `--border` | #D7D9CE | Noninteractive separators |
| Control outline | `--control` | #767E70 | Inputs, secondary buttons |

Do not communicate evidence state by colour alone. Structural borders are not control boundaries. Forest on paper and paper on forest are approved pairings; see validation report for measured ratios. There is no dark theme in this scoped MVP.

## Typography
Self-hosted `@fontsource-variable/geist`, variable weight. Fallback system-ui, sans-serif. Source and license remain in installed package; retain license when redistributing a built font.
- Wordmark: 29px/1.5, 650, tight tracking; mobile 26px. Below 360px, navigation moves to its own row.
- Discover headline: 40–66px desktop, 44px phone (36px below 360px), 550, 1.12, -0.055em; intentional two-line tagline.
- Page title: Discover greeting 40–66px (44px phone). Explore/Saved titles 30–40px; detail name 34–48px. Weight 550, leading 1.12, tracking -0.035em.
- Section title: 28px/1.12, 550.
- Card title: 21px desktop, 23px phone, 550.
- Lead: 19px/1.55, mobile 17px; detail mobile 16px.
- Body: 16px/1.5. Card body and evidence notes: 14px/1.5. Metadata: 13px/1.55. Caption 12px; image label 11px only.
- No text embedded in images. Sentence case, no all-caps metadata. Avoid truncating place names. Use actual content with long-name tests.

## Layout and spacing
4px base; preferred steps 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64. Max width 1200px; desktop outer gutters 32px; mobile 16px.
- ≥1000px: four listing columns, 20px gutters. At 1264px viewport, 1200px content = 4×285 + 3×20. Detail uses a 2fr / 1fr grid: photo then evidence on the left, a sticky “Plan a visit” panel on the right from the photo’s top edge, so the photo, visit facts and directions share the first desktop screen.
- 768–999px: detail grid 1.4fr / 1fr. 640–999px: two listing columns; two work-mode columns on Discover; filter disclosure whose button shows “· N active” for hidden filters that are on. Intro stays two columns until 639px.
- ≤767px: detail stacks photo → visit panel → evidence. ≤639px: single listing column; two work-mode columns on Discover; Explore work modes as one row of chips that scrolls inside itself, never the page; stacked intro, full-width search; no floating action covers content.
- Discover has a 1:1 text/photo split with 64px gap desktop. Photo ratio 1.12 desktop and 1.65 phone. Listing ratio 1.45. Detail ratio 1.9 desktop / 1.4 below 768px.
- Footer has useful brand and provenance links; no newsletter or invented contact info.

## Components and states
Cards have image corners at 8px, no resting shadow, no boxed body. Panels/control corners 8px; tiny photo label 4px. Native controls have clear 1px outlines, ≥46px height; radio/checkbox labels create ≥44px target. One primary forest action per context. Explore work modes are native radios presented as 44px pill chips (selected = charcoal fill, paper text; focus ring on the chip via :has). Evidence pills: 26px tall, 13px/500, fully rounded; tone by `evidenceTone()` — positive (current verified yes) lime fill + ✓; negative (verified no) neutral #E4E5DC + ×; caution (reported, conflicting, needs recheck) paper with dashed control border + !; unknown (not checked) transparent with border + –. The label words always carry the meaning; colour and glyph never stand alone. Only a current verified yes uses the lime signal. Save overlays are opaque paper; selected state lime with forest border plus “Saved” and pressed semantics.

Hover is restrained outline/ink feedback, never image zoom or reflow. Focus: 3px forest outline, 4px offset. Default motion: colour/border transition 140ms, no entrance animations. Reduced-motion preference disables those transitions. No scroll hijack, parallax or autoplay.

## Photography
Four bundled Unsplash images are illustrative only. See source IDs and URLs in SOURCES.md. They must not be treated as Dubai venue photos. Maintain persistent fictional banner and image captions. Replace with licensed real venue photographs before launch; preserve source, rights holder, permitted use and alt text in editorial records. Keep meaningful interior alt text on detail images; linked card images are decorative because adjacent title provides the accessible link name. Set dimensions to reserve layout, lazy-load lower photos, eager-load the first viewport image. Consider AVIF/WebP variants after real image selection; no remote image dependency at runtime.

## Accessibility contract
Target WCAG 2.2 AA; this target requires manual assistive-technology validation, not merely a build.
- Landmarks, skip link, one h1, logical headings, active nav via aria-current, visible labels and native form controls.
- Search and selects work by keyboard. Native radio group supports arrow keys. Filter toggle uses aria-expanded/controls and does not trap focus (it is an inline disclosure, not a modal).
- Save is a separate button, never nested in a card link. Use aria-pressed and action-specific accessible name. Live region announces save/remove and storage failure.
- Dynamic result count is polite. Empty-state action is reachable. Removing a focused saved card moves focus to the next save or empty-state link.
- Text ≥4.5:1 except qualifying large text ≥3:1; focus and interactive boundaries ≥3:1. Pairings must be rechecked after any token change.
- At 200% zoom/320px CSS viewport: no horizontal page scrolling, clipped actions or fixed overlays. All core information remains available.
- No colour-only statuses, tooltip-only evidence, hover-only controls or inaccessible custom dropdowns. Unknown access is never described as accessible.
- External Maps link announces new tab. No automatic geolocation request. Respect reduced motion.
