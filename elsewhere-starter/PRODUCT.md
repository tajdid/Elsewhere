# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People in Dubai who work remotely (freelancers, remote employees, visitors on a short stay) deciding where to work today, usually on a phone. They want to know before they go whether the Wi-Fi is fast enough, whether they'll find a socket, how noisy it gets and how to get online.

A second, smaller audience: people who know a good spot and want to add it or correct a listing.

## Product Purpose

Elsewhere (intended domain elsewhere.work, tagline "Work from somewhere new.") is a short, mobile-first guide to laptop-friendly cafés, co-working spaces, restaurants, bars and hotel lounges in Dubai. Success is someone picking a place with confidence and finding it as described: a Wi-Fi speed, sockets and noise they can plan around, and directions that take them to the right door.

## Positioning

A personally curated list, kept honest. The places come from the owner's own list of spots worked from or noted over the years, not from scraped directories, and every detail is labelled with where it came from and when (Reported or Verified). Missing facts say "not added" rather than guessing; visitor reports are read by hand before they change anything. Google Maps and blog roundups offer coverage; Elsewhere offers someone's judgement plus an honest date on each fact.

## Operating Context

- Four main screens: Discover (home), Explore (search and combined filters), place pages, and Saved. Supporting pages: About, Submit a place, neighbourhood pages (`/dubai/<area>/`) and collections (`/collections/<slug>/`).
- Typical use: on a phone, deciding where to go next; comparing a few places; opening directions; copying a guest Wi-Fi password on arrival.
- Four work modes frame the browse: Focus, Casual, Meetings, Together.
- Saving is browser-local (no account, no sync).
- Submissions go to a Google Sheet as "Pending" and are reviewed by hand; approved places reach the site through the owner's import process. Nothing is published automatically.

## Capabilities and Constraints

- Stack: Astro static site, strict TypeScript, Tailwind 4, self-hosted Geist; small client-side modules; Vercel hosting with two serverless endpoints (`/api/submit` to Google Sheets, `/api/places` for Google Places search and live opening hours).
- Data: `src/data/places.json`, 55 real venues: 53 imported from the owner's Notion list "WFH in Dubai" (entries added 2020–2023) and 2 added from visitor reports on 26 Nov 2026. Every fact is Reported, none Verified yet.
- Evidence model: per amenity (Wi-Fi, power, laptops, calls, step-free) with value yes/no/unknown, state (unknown, reported, verified, conflicting; stale is derived), source and date. Verified filters need a yes, independent verification, a source and date, at most 90 days old.
- Google data: only place IDs are stored. Opening hours and maps are fetched live and credited to Google where shown; Google's hours, addresses and coordinates are never copied into the list.
- Directions use the owner's Google Maps link, then a Google place ID, otherwise a labelled search by name.
- Guest Wi-Fi passwords from the list are shown with a Copy button and the date they were listed, at the owner's request.
- No authentication, accounts, ads or cookies; visits are counted with cookieless Vercel Web Analytics.
- Production on Vercel is indexable; previews and local builds are noindex.
- Terminology: "Reported", "Verified", "Needs recheck", "Conflicting reports", "Not added", "Visited by Elsewhere".

## Brand Commitments

- Name "Elsewhere", tagline "Work from somewhere new."
- Voice: plain, British English, short sentences, no hype; say what a detail means and how old it is.
- Palette fixed by the owner: paper #F7F6F2, charcoal #20231F, forest green #285943, muted lime #DCE9B5 (lime reserved for saved and current verified yes). No dark mode.
- Self-hosted Geist; restrained motion with reduced-motion respected.
- Made by Tajdid Rahman (tajdidrahman.co.uk).

## Evidence on Hand

- 55 venues with real but dated facts in `src/data/places.json`; 14 marked visited by Elsewhere; 39 with confirmed Google place IDs.
- Many gaps are real and must stay visible: 29 places without a neighbourhood, 47 without a summary, several without type, speed or noise.
- No real venue photos. The stock images in `public/images` are temporary stand-ins and are not evidence about any venue. Current direction: design without photos until licensed photos of each venue exist.
- No testimonials, ratings, reviews, press, partner logos or usage figures exist. Do not fabricate any, and never claim live opening status, seating availability or verification without supporting data.

## Product Principles

1. Truth before polish: show what is known, when it was known and where it came from; an honest "not added" beats a confident guess.
2. Decide on a phone in under a minute: the facts that decide a visit (Wi-Fi, sockets, noise, how to get online, how to get there) come first.
3. A person's list, not a directory: curated and opinionated, with the owner's own notes, rather than exhaustive coverage.
4. Contributions are welcome and checked: make reporting easy, never publish it automatically.
5. Light and private: static pages, no accounts, no tracking cookies, saves stay on the device.

## Accessibility & Inclusion

Target WCAG 2.2 AA: landmarks, skip link, one h1 per page, native labelled controls, visible focus, adequate contrast and touch targets, accessible save buttons with aria-pressed, polite live announcements, clear new-tab links, useful focus restoration, no hover-only essentials, and reduced-motion support. Automated checks don't replace assistive-technology testing, which has not been done yet.
