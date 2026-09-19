# CCL Website — Community Co-creation Lab for Local Climate Resilience

Long-term public research archive and atlas for the University of Mumbai's COOL CRYMB project (COmmunity cO-creation lab for Local Climate Resilience: empowering Youth with green skills in Mumbai and Bristol), run with the British Council, HSBC and the University of Bristol.

**Status:** Technical Implementation Pilot (Palghar)  
**Budget:** None — free tools only, with defined upgrade paths.

## What the site is

1. **Home** — What the research is, who does it, why; scroll arrow to the data-driven district selector.
2. **District portals** — One themed section per district (list is data-driven; never hard-coded).
3. **Village / community profiles** — Inside each district: community information, people (consent-gated), surveys, flora and fauna, maps, media, challenges and responses, heritage. Empty sections are hidden automatically.
4. **Community visits & research access** — A reviewed request process, not open tourism.
5. **Marketplace** — Separate system, linked from the site; enquiry-only until operations are funded.
6. **Later:** Research Atlas (map + filters) and global search, once data is clean.

## Documentation Index

- [`docs/01-PRD.md`](docs/01-PRD.md) — Goals, audiences, scope, open questions
- [`docs/02-SITEMAP-AND-PAGES.md`](docs/02-SITEMAP-AND-PAGES.md) — Pages and sections specs
- [`docs/03-ARCHITECTURE.md`](docs/03-ARCHITECTURE.md) — Free-tool stack, visibility enforcement, upgrade triggers
- [`docs/04-CONTENT-MODEL.md`](docs/04-CONTENT-MODEL.md) — Records, common fields, consent, evidence schemas
- [`docs/05-DESIGN-AND-THEMES.md`](docs/05-DESIGN-AND-THEMES.md) — Design system and district themes
- [`docs/06-STORE.md`](docs/06-STORE.md) — Marketplace options and phasing
- [`docs/07-VISIT-REQUESTS.md`](docs/07-VISIT-REQUESTS.md) — Community visits & research access workflow
- [`docs/08-PRIVACY-CONSENT-ETHICS.md`](docs/08-PRIVACY-CONSENT-ETHICS.md) — Consent, visibility, sensitive places, ethics
- [`docs/09-ROADMAP.md`](docs/09-ROADMAP.md) — Phases, roles, risks
- [`docs/10-EVIDENCE-REGISTER.md`](docs/10-EVIDENCE-REGISTER.md) — Evidence status and claims verification
- [`docs/11-DATA-LIFECYCLE.md`](docs/11-DATA-LIFECYCLE.md) — Data lifecycle, aggregation, and retention
- [`docs/12-OWNERSHIP-AND-HANDOVER.md`](docs/12-OWNERSHIP-AND-HANDOVER.md) — Ownership, asset register, handover plan
- [`CLAUDE.md`](CLAUDE.md) — Working agreement for AI coding assistants

## Ground Rules

- Facts come from the team's own verified data, tracked in the Evidence Register. AI summaries are never sources.
- No person, photo or sensitive location is published without consent and review. Enforced at build time.
- Restricted data never enters the site repo.
- Numbers on the site are computed from records, never typed in.
- Works on cheap phones and slow networks, in English, Marathi and Hindi.
