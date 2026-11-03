# Prompt to paste into Claude

You are implementing Elsewhere, a mobile-first Dubai workspace discovery website. I have attached a handoff ZIP with an existing Astro/TypeScript/Tailwind starter, complete specification, sample data, tests and design previews.

Unpack the ZIP and use the existing starter as the baseline. Read START-HERE.md, then elsewhere-starter/CLAUDE.md and the specification. Do the implementation and packaging work, not just planning. Review what already works before changing it, resolve concrete gaps, polish the four screens, verify the result and deliver a complete downloadable ZIP.

Brand: Elsewhere; intended domain elsewhere.work; tagline “Work from somewhere new.” Discover laptop-friendly cafés, co-working spaces, restaurants and hotel lounges in Dubai. Design: simple, clean, self-explanatory, photography-led, Mobbin-inspired editorial hierarchy, Geist, warm off-white #F7F6F2, charcoal #20231F, forest green #285943 and muted lime #DCE9B5. Use Taste Skill (design-taste-frontend) as guidance while preserving these explicit requirements. Keep motion restrained.

Required screens and behavior: Discover, Explore, Place details and Saved; functional search and combined filters; Focus, Casual, Meetings and Together work modes; shareable Explore URLs and browser history restoration; directions; local-storage saves with no authentication. Keep keyboard access, useful empty states, mobile reflow, reduced motion and honest storage failure feedback.

Accurate evidence is essential. Keep fictional sample data clearly labelled. Never invent factual claims about real venues. Verify individual amenities separately; show source, date, value and evidence state. Unknown, reported, conflicting, stale and negative observations must not pass a verified-positive filter. No venue-wide “verified” badge. Fictional directions must remain neighbourhood-only and clearly labelled. Domain availability is user-reported; trademark clearance is not done.

Deliver the complete PRD, design system/tokens, IA, page/component specifications, interactions, accessibility requirements, validated data schema, realistic labelled fixtures, acceptance criteria, Claude/Codex project instructions, Taste Skill installation/use steps, local run instructions and runnable source. Update the included docs to match your final implementation.

Run the unit tests, TypeScript/Astro build and browser tests. Review production screenshots at 390, 768 and 1440px and test 320px overflow. Distinguish checks you actually performed from remaining manual or launch work. Do not claim trademark clearance, real venue verification, deployment or tests that did not happen.

Package the final deliverables in delivery/elsewhere-mvp.zip, with source, lockfile, assets, documentation, screenshots, validation report and checksum manifest. Exclude dependencies, caches, secrets and generated test output. Verify archive integrity and test a fresh extracted copy. Follow the detailed packaging contract in CLAUDE.md. Provide download links and these local steps: unzip, cd elsewhere-starter, npm ci, npm run dev.

Proceed autonomously with sensible implementation choices. Do not stop after a plan or ask me to approve routine reversible work. Do not deploy, buy a domain or send external messages.

If you cannot execute code or create files in this Claude environment, explain that limitation immediately and give me instructions to open this folder in an environment that can; do not pretend to have built or packaged it.
