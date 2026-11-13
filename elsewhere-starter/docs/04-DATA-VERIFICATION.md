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
| hoursNote | string | Human-readable qualifier shown with the hours (or instead of them when `hours` is null) |
| policyNote | string | Laptop windows, purchase/booking requirements if sourced |
| address | string or null | Null for all sample venues |
| coordinates | `{lat,lng}` or null | Valid latitude/longitude ranges, null for all fixtures |
| website | URL or null | Null for all fixtures; shown only when set, opening in a new tab |
| amenities | object | All five evidence records required |
| wifiSpeed | `{downMbps, upMbps or null, measuredAt, source}` or null | One dated speed test. Older than 90 days or future-dated reads “needs retest”. Not allowed when Wi-Fi is “no” |
| wifiAccess | `{value: open/password/signup/unknown, password or null, source, checkedAt}` | Known values need a source and date. `password` only when the value is `password`. It's shown with Copy and its listed date, since passwords change |
| hours | `{source, checkedAt, week: {mon…sun: [open, close] or null}}` or null | Usual hours in 24-hour Dubai time; a close at or before the open runs past midnight; equal times mean 24 hours; null day = closed |

Fixture amenities: wifi, power, laptops, calls, stepFree. Wi-Fi speed, Wi-Fi access and usual hours are separate dated records (above), never inferred from the Wi-Fi evidence. Toilets, parking, noise, prayer space, outdoor seating, accessibility beyond step-free entry, and sockets per table are **not inferred**. Add separately verified fields if introduced.

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

## Place inventory
53 places from the owner's Notion database “WFH in Dubai” (collection dbf937f7…), imported 13 Nov 2026 by a one-off converter. Mapping:
- **Name, website, menu link, Google Maps link** are copied. A plain-text “Directions” value becomes `locationNote`.
- **Tags** (Cafe, Co-working, Restaurant, Bar) become `tags`, and the first tag becomes `category`. Untagged places show “Type not added”.
- **Speed (Mbps)** becomes `wifiSpeed`, dated to when the entry was added. **Password** becomes `wifiAccess`: “No password” is open, “Sign up” is sign-up, “Ask server” is a password from staff with none listed, and any other value is the guest password itself (`wifiAccess.password`, 13 places). It's shown on cards and the place page with a Copy button and the month it was listed.
- **Sockets** (⚡ count, 1–5) become `sockets` and Reported power evidence. **Noise level** becomes `noise` and Reported calls evidence (loud is a reported “no”). **Entry type** becomes `entry`. **Visited** becomes `visited` and source “Elsewhere visit”; otherwise the source is “Elsewhere list”.
- **Area** is set only where the list names it (title, directions, notes or website): 24 of 53. Everything else reads “Area not added”.
- **Laptop policy, step-free access and hours** are not in the list, so they stay unknown. Work modes are derived from noise and co-working tags as suggestions.
- **Photos:** temporary stock photos (scene-1 to scene-8) are assigned by type in rotation. Alt text and credit say “not this venue”, and the place page captions each one.

## Wi-Fi details and usual hours
- **Speed** is a snapshot from one test, shown with its tester and date and a plain tier: 50+ Mbps “Plenty for video calls”, 20+ “Good for video calls”, 5+ “Fine for email and browsing”, otherwise “Slow for most work”. A speed never upgrades the Wi-Fi evidence and does not count towards the Verified Wi-Fi filter.
- **Access** says how to get on (no password, password from staff, sign-up page). Publishing passwords is out of scope: they change, and venues may not want them shared. The report form asks visitors not to include them, and the payload has no password field.
- **Hours** are usual hours as checked, with a source and date. The UI says “Usually 8 am – 5 pm today” or “Usually closed today”, with today worked out in Dubai time when the page is read, and never “open now”. The visit panel adds that public holidays and Ramadan hours may differ, and still tells visitors to check with the venue.
