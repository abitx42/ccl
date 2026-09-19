# 02 — Sitemap and Page Specs

```text
/                          Home (en)          /mr/   /hi/  (same tree per language)
├── #districts             District selector section (reached via the scroll arrow)
├── /districts/            Districts index (same content as selector; works without JS)
│   └── /districts/[slug]/ District page  (themed)
│       └── /districts/[slug]/villages/[village]/   Village / community profile
├── /visit/                How visiting works + code of conduct
│   └── /visit/request/    Visit request form (?district=&village=)
├── /store/                Link-out or enquiry catalogue → marketplace (separate system)
├── /atlas/                Research Atlas: map + filters (later phase, needs clean data)
├── /search/               Site-wide search (Pagefind, later phase)
├── /sources/              Evidence & sources behind published claims
├── /research/             Methodology, five-step co-creation process, publications, downloads
├── /about/                Project, partners (British Council, HSBC, Bristol, UoM)
├── /team/                 Faculty, master trainers, RAs, student leaders (consent-gated)
├── /contact/
└── /privacy/ , /terms/ , /accessibility/
```

## Home Page Sections (in order)

1. **Hero** — Project name, one-sentence purpose, hero background, language switcher.
2. **What & Why** — 3 short blocks: problem (vulnerability), approach (co-creation labs, green skills), outcome.
3. **Numbers** — Only figures computed from verified records (`content/site/stats.yaml`).
4. **How it Works** — The 5 steps: Geographic Targeting → Community Profiling → Social Cartography → Co-design → Field Execution.
5. **Partners** — Verified partners and approved branding.
6. **Scroll Arrow** — Large animated arrow at the bottom. Smooth-scrolls to `#districts` (respects `prefers-reduced-motion`).
7. **District Selector** — Cards (photo + name + hook + district accent colour) data-driven from available content.
8. **Footer**.

## District Page Sections

- Overview & Tagline
- Research Highlights & Methodology
- Villages / Communities in the District (cards)
- Aggregated Surveys & Climate Findings
- Regional Flora & Fauna
- Local Challenges, Responses & Outcomes
- Cultural & Geographical Heritage (if verified)
- Media Gallery (consent-gated)

*Rule: Any section with no verified records is automatically hidden, never shown empty.*

## Village / Community Page Sections

- About the Village / Community (differentiating community account vs documented source)
- People & Local Leadership (consent-gated)
- Village Surveys & Data
- Local Flora & Fauna sightings
- Specific Challenges, Interventions & Outcomes
- Access / Visit Request CTA button
