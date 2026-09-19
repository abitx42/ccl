# 04 — Content Model

Content is stored as YAML/Markdown files, validated at build time with Zod schemas. `i18n` fields hold `{ en, mr, hi }`.

## Hierarchy

```text
Platform
├── District 1──N Village/Community ── (references N People: ["PPL-xxxx"])
│                                   ├─N Survey (aggregated public summary)
│                                   ├─N Species observation
│                                   ├─N Challenge ──N Response/Solution ──N Outcome
│                                   ├─N Heritage item
│                                   ├─N Media (consent-gated)
│                                   ├─N Product ──► Store
│                                   └─N GeoLayer
├── People (`content/people/PPL-xxxx.yaml`): Centralized, reusable community contributors (consent-gated)
└── Cross-cutting: Evidence claim, Source, Project, Field visit
```

## Common Block (Required on all records)

```yaml
id: PAL-VIL-0003            # stable, never reused; format: <district>-<type>-<number>
status: draft | in_review | verified | published | needs_correction | archived
visibility: public | research_team | community_only | restricted | unpublished
verification:
  level: verified | researcher_provided | user_provided | inference | placeholder
  verified_by: "name/role"
  verified_on: 2026-09-01
evidence: [ EV-0001, EV-0014 ]   # claims/sources backing this record (see EVIDENCE-REGISTER)
created_by: ""
created_on: ""
updated_on: ""
```

**Rendering rule:** A record appears on the public site only if `status: published` AND `visibility: public` AND its consent (if any) is satisfied.

## Consent Block (People, photos, video, audio, quotes)

```yaml
consent:
  state: granted | pending | withdrawn | not_required
  scope: [ name, photo, quote, story, video ]
  form_id: "CF-2026-014"        # reference only; the form itself is private
  obtained_on: 2026-08-02
  obtained_by: ""
  guardian_consent: false       # required if under 18
```

## Schemas Summary

### District (`content/districts/[slug]/district.yaml`)
```yaml
slug: palghar
name: { en: "Palghar", mr: "पालघर", hi: "पालघर" }
theme: palghar
tagline: { en: "Indigenous agro-forestry & coastal resilience", mr: "...", hi: "..." }
coordinates: { lat: 19.6967, lng: 72.7699 }
hero: { image: "./hero.jpg", alt: { en: "...", mr: "...", hi: "..." }, credit: "..." }
research_period: { start: "2025-06", end: "2026-10" }
```

### Village / Community (`content/districts/[slug]/villages/[slug]/village.yaml`)
```yaml
id: PLC-0002
slug: manor
district: palghar
name: { en: "Manor", mr: "मनोर", hi: "मनोर" }
community_type: tribal | fishing | farming | mixed | urban | other
geography:
  administrative_district: "Palghar"
project:
  research_district: "palghar"
  classification_confirmed: true
livelihoods: [ "Agro-forestry", "Warli craft" ]
about: { en: "...", mr: "...", hi: "..." }
sensitive_location: false
people: [ "PPL-0001" ]          # references centralized People records by ID
```

### Person (`content/people/PPL-xxxx.yaml`)
Centralized, reusable community contributor entity. Scalable from 1 to hundreds without modifying templates or page code.
```yaml
id: PPL-0001
status: published
visibility: public
role: "Certified Master Trainer & Faculty Lead" # flexible: string, i18n object, or array
name: { en: "Dr. Nilesh Jawalkar", mr: "...", hi: "..." }
community:
  district_id: "palghar"
  village_id: "PLC-0002"
places:                         # optional: places this person is associated with (e.g. cross-village/district researchers)
  - "PLC-0002"
photo: "./photo.jpg"            # optional
photo_credit: "Photographer Name" # public UI shows: Photo by [Name]
photo_alt: { en: "..." }
consent:
  state: granted
  scope: [ name, story ]        # photo displayed only if 'photo' is in scope
```
*Note:* The two relationships serve distinct, complementary purposes:
- `Village.people[]` → "Who should appear on this village page?"
- `Person.places[]`  → "Which places is this person known to be associated with?"
If no approved/consented photo exists (or `'photo'` is not in `consent.scope`), the public UI renders the person card cleanly without an empty image placeholder.

### Contextual Quotes & Oral History
Quotes and oral testimonies are **contextual** and attached directly to the record where they are used (Challenge, Intervention, Heritage, Community Account), never stored as a random collection on the person profile.
```yaml
quote:
  text:
    en: "Seasonal tidal ingress now overtakes our secondary embankments earlier in June."
    mr: "..."
    hi: "..."
  contributor: "PPL-0001"       # references Person ID (validated at build)
  attribution: "Dr. Nilesh Jawalkar"
  consent:
    state: granted
    scope: [ quote ]            # independent quote consent
  evidence:
    - EV-0001
```
*Consent Independence:* A contributor can grant profile publication consent (`name`, `story`), while withholding photo consent, or grant a quote consent for a specific challenge response without making that quote reusable elsewhere.

### Survey (`content/districts/[slug]/villages/[slug]/surveys/*.yaml`)
Aggregated, anonymised only. Raw data lives in private research storage. Many-to-many link to places (`places: ["PLC-0002"]`).

### Species Observation (`.../species/*.yaml`)
Flora or fauna observation with IUCN status and coarse precision for threatened species.

### Challenge & Response (`.../challenges/*.yaml`)
Challenges mapped to community, student-led, or institutional responses and measured outcomes. Includes optional contextual `quotes` and intervention `quote` blocks.

