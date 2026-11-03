# Elsewhere · Claude handoff

## Use this package
1. Download and unzip Elsewhere-Claude-Handoff.zip.
2. In a Claude environment that can work with local files and run the project, open the extracted elsewhere-starter/ folder. For a Claude chat with file execution, attach this ZIP and ask it to unpack the contents.
3. Copy the contents of CLAUDE-PROMPT.md into Claude. The starter includes CLAUDE.md with the detailed execution and packaging contract.
4. Claude should inspect/refine the supplied project, run its checks and return a new final package. It should not rebuild from scratch without a reason.

## Included
- CLAUDE-PROMPT.md: ready-to-paste task prompt.
- elsewhere-starter/CLAUDE.md: project instructions for Claude.
- Elsewhere-MVP-Specification.md: complete prior specification.
- elsewhere-starter/: runnable Astro/TypeScript/Tailwind source with all four screens, tests, sample data, docs, bundled photos/fonts through dependencies and previews.
- MANIFEST.sha256: archive payload checksums (manifest itself excluded).

## Taste Skill
The starter includes checked installation guidance in docs/06-IMPLEMENTATION-CODEX.md and links to the official Taste documentation in docs/SOURCES.md. For a different coding agent, use the core installer and select that agent in the installer rather than reusing the Codex-specific -a codex selector:

```sh
npx skills add https://github.com/Leonxlnx/taste-skill --skill design-taste-frontend
```

Choose the intended agent/project destination, inspect the installed SKILL.md, and explicitly ask the agent to apply design-taste-frontend. Installation needs network access. If a skill cannot be installed, Claude should state that and continue using the included design-system spec without falsely claiming a skill audit ran.

## Run the supplied baseline
With Node 22.12+ and npm, from elsewhere-starter/:

```sh
npm ci
npm run dev
```

Open http://localhost:4321. For checks use npm test, npm run build and (after installing Chromium) npm run test:e2e.

## Status
The original starter passed 8 unit/data tests and 8 browser tests, and built with zero Astro/TypeScript diagnostics. Those historical results are recorded in its validation report; Claude must rerun checks in its own environment. This handoff adds instructions only and does not claim a new application test run.

All venue concepts/evidence/prices are fictional, photos illustrative, directions neighbourhood-only. Real venue verification, domain ownership and trademark clearance remain before launch. No deployment is requested.
