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
| hoursNote | string | Human-readable uncertainty; not machine opening hours |
| policyNote | string | Laptop windows, purchase/booking requirements if sourced |
| address | string or null | Null for all sample venues |
| coordinates | `{lat,lng}` or null | Valid latitude/longitude ranges, null for all fixtures |
| amenities | object | All five evidence records required |

Fixture amenities: wifi, power, laptops, calls, stepFree. Wi-Fi speed, toilets, parking, noise, prayer space, outdoor seating, accessibility beyond step-free entry, and sockets per table are **not inferred**. Add separately verified fields if introduced.

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

## Fixture inventory
All names below are invented concepts even if coincidental real-world name similarities exist. No assertions are made about similarly named businesses.
| ID | Fictional concept | Actual area label | Scenario |
|---|---|---|---|
| demo-01 | Palm & Paper Studio | JVC | Verified negative Wi-Fi, mixed evidence |
| demo-02 | Canal Reading Room | Business Bay | Reported Wi-Fi, current positive calls |
| demo-03 | The Long Table Works | JLT | Unknown Wi-Fi, mixed current evidence |
| demo-04 | Terrace Eight Kitchen | Dubai Marina | Current positive Wi-Fi and conflicting power |
| demo-05 | Sikka Study Club | Al Quoz | Conflicting Wi-Fi, expired verification records |
| demo-06 | Creekside Common Room | Al Jaddaf | Current positive Wi-Fi and reported power |
| demo-07 | Neighbourhood Desk House | JVC | Reported Wi-Fi and unknown power |
| demo-08 | Juniper Lunch Room | JLT | Unknown Wi-Fi and current positive power |

The eight entries cover four categories, six neighbourhoods and four modes. All address/coordinate fields are null; prices are illustrative AED ranges; hours are unknown. See JSON for exact timestamps and individual amenity values. Do not convert fixtures into real venues by merely removing sample labels.
