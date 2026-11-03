# Elsewhere project instructions
Read README.md and docs/01-PRD.md through docs/06-IMPLEMENTATION-CODEX.md before extending this starter.

- Keep Astro static output, TypeScript strict and Tailwind 4 via @tailwindcss/vite. Use native HTML and small client TypeScript; do not add React or a backend without product need.
- Preserve explicit Elsewhere brand, Geist and tokens. Use design-taste-frontend for design work when installed; read the applicable skill first. User requirements override skill defaults. Record intentional deviations and review real screenshots at phone/tablet/desktop sizes.
- Never invent factual claims, prices, accessibility, Wi-Fi speeds, opening status, reviews or provenance about real venues. All supplied fixtures stay isSample=true and visibly fictional. Stock photos are illustrative only.
- Verification is per amenity. Reported, unknown, conflicting, stale and no never pass a verified-positive filter. Keep verification source/date/context. Do not bump dates to hide staleness.
- Do not add a global verified venue badge or infer access from photos. Keep noindex on demo pages. Preserve local-only save behavior and failure feedback.
- URLs are the Explore state. Keep keyboard semantics, native controls, live announcements and visible focus. No clickable divs or nested interactive controls.
- Run npm test and npm run build after meaningful changes. Run browser tests for interaction changes. Do not claim tests or accessibility checks ran unless executed. Review image crops, 320px overflow and 200% zoom for layout work.
- Maintain docs and tests when contracts change. No secrets in client code; no unsolicited analytics/auth/payments. Do not buy domain, deploy or send venue outreach unless requested.
- Ship with a lockfile; exclude node_modules, .astro, dist, test-results and playwright-report from source ZIPs. Preserve media credit/license information.
