# Elsewhere · instructions for Claude

## Mission
Complete, refine and package the Elsewhere MVP described in the included specification. Use the supplied starter as your baseline. Inspect before changing; preserve working behavior. If the source is unavailable, implement the same scope from the specification. Deliver working files, not just a plan or code excerpts.

## Read first
1. README.md and AGENTS.md.
2. docs/01-PRD.md through docs/07-VALIDATION.md.
3. docs/SOURCES.md, docs/tokens.json and the supplied screen previews.
4. src/lib/schema.ts, src/lib/discovery.ts, src/data/places.json and tests/.

The documents specify the product. The validation report describes earlier checks, not tests you have personally run. Rerun relevant checks and record your own results. Explicit user requirements take priority over skill defaults.

## Fixed product scope
Elsewhere (intended domain elsewhere.work), tagline “Work from somewhere new.” A mobile-first Dubai guide to laptop-friendly cafés, co-working spaces, restaurants and hotel lounges. Four screens: Discover, Explore, Place details, Saved. Use Astro static pages, strict TypeScript and Tailwind 4 via @tailwindcss/vite; retain the lockfile and existing dependency baseline unless a concrete problem warrants an upgrade. Prefer native HTML and small client-side modules. No authentication or backend required.

Implement and retain functional search, combined filters, four work modes (Focus, Casual, Meetings, Together), shareable filter URLs with browser Back/Forward restoration, Google Maps directions, local-storage saves and useful empty states. Handle malformed/unsupported storage, blocked writes, cross-tab changes and focus after removal. Saves are browser-local with no cloud-sync promise.

## Brand and design
Simple, clean and self-explanatory, with enough information to make a decision. Mobbin-inspired editorial typography and hierarchy, not copied layouts/assets. Photography-led listings, restrained motion, self-hosted Geist.
- Paper #F7F6F2; charcoal #20231F; forest green #285943; muted lime #DCE9B5.
- Follow the semantic tokens and responsive rules in the design-system document.
- Use Taste Skill (design-taste-frontend) when installed, reading the actual SKILL.md first. Do not introduce dark mode, heavy motion or change the explicit palette just to follow a skill default.
- Review real screenshots of all four screens at 390, 768 and 1440px; also check 320px overflow, 200% zoom and reduced motion. Fix visible issues before packaging.
- Keep photo provenance, captions and licensing information. Never use stock imagery as evidence about a real venue.

## Truthfulness and evidence
Places come from the owner’s Notion list “WFH in Dubai” (imported 13 Nov 2026; 53 real venues, isSample=false). Every fact is copied from that list and dated by when the entry was added (2020–2023): status is Reported, never Verified, until someone re-checks it. Missing facts stay null/unknown and the UI shows “not added” placeholders; never fill them from general knowledge about similarly named businesses. Areas are set only where the list names them. At the owner’s request, guest Wi-Fi passwords from the list are shown with a Copy button, labelled with when they were listed. At the owner’s request (13 Nov 2026) places show temporary stock photos, chosen by type from public/images, until real photos exist. Their alt text and credit say they are not the venue, and the place page captions each one “Temporary photo, not this place”. Replace them with licensed photos of each venue before launch. Directions use the owner’s Google Maps link when present, otherwise a labelled Google Maps search by name. noindex stays until the owner decides to launch.

Evidence belongs to each amenity, not a whole venue. Display yes/no/unknown, state, source, observation date and context. States: unknown, reported, verified, conflicting; stale is derived. Verified positive filters require yes + independently verified + a source/date + no more than 90 days old + a non-future timestamp. Verified no, unknown, reported, conflicting and stale never pass those filters. Do not update dates without new evidence. Wi-Fi availability does not establish speed, and photographs do not establish step-free access.

Places without a validated address or coordinates get neighbourhood-level directions, and the visit panel says the link opens the area. Real venue directions require a validated address or coordinates. Never claim current opening status, live seating availability, real ratings or venue verification without supporting data.

Domain availability was reported by the user. Ownership, purchase and trademark clearance are not established. Do not buy, deploy, publish, contact venues or send messages unless explicitly requested.

## Accessibility
Target WCAG 2.2 AA: landmarks, skip link, one h1, native labelled inputs/radios/selects, visible focus, adequate contrast and touch targets, accessible save names/aria-pressed, polite live announcements, understandable new-tab links and useful focus restoration. No nested interactive elements or hover-only essentials. Automated tests are not a substitute for assistive-technology testing; record unperformed checks honestly.

## Execution
1. Inspect the source/docs and summarize only material gaps. Continue into implementation without stopping at a plan.
2. Install with npm ci; run the existing tests/build to establish the baseline.
3. Improve concrete gaps within scope, update docs/contracts with changes, and add tests for meaningful behavior changes.
4. Run npm test, npm run build and npm run test:e2e. Install the Playwright browser if needed with npx playwright install chromium. If browser tooling is unavailable, state the exact limitation; never call unrun checks passing.
5. Review the production preview, not only development rendering. Check images/fonts load, filters and counts agree, and there are no browser errors or horizontal overflows.
6. Produce the complete handoff described below. Make routine implementation choices independently; ask only when a real blocker requires missing information.

## Final deliverables and packaging
Create a delivery/ directory containing:
- elsewhere-starter/ with the complete runnable source, package.json, package-lock.json, config, public assets, fixtures, tests, README.md, CLAUDE.md, AGENTS.md and docs.
- Elsewhere-MVP-Specification.md: consolidated, current specification covering PRD, tokens, IA, pages/components, interactions, accessibility, schema/evidence, sample-data inventory, acceptance criteria, local run steps and Taste Skill setup.
- previews/ with screenshots of all four screens at phone/tablet/desktop widths.
- VALIDATION.md with commands actually run, outcomes, environment, screenshot review, limitations and launch prerequisites.
- MANIFEST.sha256 covering delivered files.
- elsewhere-mvp.zip containing the above deliverables (excluding the ZIP itself and its own checksum).

Exclude node_modules/, .astro/, .git/, test-results/, playwright-report/, caches, credentials, environment secrets and OS metadata. Exclude dist/ from the source package; if requested, provide a separate clearly named static-build archive. Preserve local assets so the installed project does not depend on remote images/fonts at runtime.

Check ZIP integrity and extract it to a fresh temporary folder. In the extracted project run npm ci, npm test and npm run build; report any environment limitation rather than claiming success. Check no files required to run are missing. Provide direct download links, a short description of contents and local commands. Do not finish with an offer to package later.
