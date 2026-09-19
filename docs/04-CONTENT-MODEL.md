# 04 — Content Model

Content is stored as YAML/Markdown files, validated at build time with Zod schemas. `i18n` fields hold `{ en, mr, hi }`.

## Hierarchy

```text
Platform
└── District 1──N Village/Community ─┬─N Person (consent-gated)
                                     ├─N Survey (aggregated public summary)
                                     ├─N Species observation
                                     ├─N Challenge ──N Response/Solution ──N Outcome
                                     ├─N Heritage item
                                     ├─N Media (consent-gated)
                                     ├─N Product ──► Store
                                     └─N GeoLayer
Cross-cutting: Evidence claim, Source, Project, Field visit
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
id: PAL-VIL-0001
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
```

### Survey (`content/districts/[slug]/villages/[slug]/surveys/*.yaml`)
Aggregated, anonymised only. Raw data lives in private research storage.

### Species Observation (`.../species/*.yaml`)
Flora or fauna observation with IUCN status and coarse precision for threatened species.

### Challenge & Response (`.../challenges/*.yaml`)
Challenges mapped to community, student-led, or institutional responses and measured outcomes.
