# 03 — Architecture (zero budget, built to grow)

## Constraints that drive everything

1. **Long-term research archive** — must still work, and still be editable, years from now.
2. **No funding today** — free tools only; upgrade paths defined for when money arrives.
3. **Small, mostly non-technical team** — editing must not need a developer.
4. **Some data is not public** — visibility and consent states must be *enforced*, not just labelled.

## Core idea

**Content lives in structured files with stable IDs; the website is generated from them.**
Every record already carries `id`, `status`, `visibility`, `consent` and `evidence` fields (doc 04), so the same records can later be loaded into a database + CMS without rewriting. "Static now, database later" is a migration script, not a rebuild.

## Free-tool stack

| Concern | Free choice | Upgrade path |
|---|---|---|
| Framework | **Astro** + TypeScript (content collections, i18n, mostly zero client JS) | Same, add server rendering / API routes |
| Source control | **GitHub organisation** account, **private repo** | GitHub paid plan / self-hosted Git |
| Hosting | **Cloudflare Pages** (free, deploys from private repos) | Paid tier / university VM |
| Editing UI | **Decap CMS** (git-based forms); fallback: Google Sheets/Forms → reviewed PR | Payload / Directus / Strapi with database |
| Search | **Pagefind** (static, in-browser, works in Marathi/Hindi) | Meilisearch / Typesense / Postgres full-text |
| Maps | **MapLibre GL JS** + GeoJSON, tiles from free tier or self-hosted **PMTiles** | Paid tile provider, PostGIS |
| Charts | Pre-rendered SVG / Observable Plot | Interactive dashboards from an API |
| Images & media | Optimised images in repo; larger archive in **Cloudflare R2** free tier | Paid object storage + CDN |
| Forms (visits) | Cloudflare Worker + free database, or Google Forms → Sheet (v1) | Supabase/Postgres + admin dashboard |
| Preservation | **Zenodo** (free DOIs, CERN-hosted) for datasets and reports | Institutional data repository |
| Analytics | **GoatCounter** or **Umami** (privacy-friendly, cookieless) | Plausible / paid |
| Store | Enquiry-only catalogue until funds/hosting exist (doc 06) | Hosted open-source store |

## Enforcing visibility and consent

A public GitHub repo or static build **cannot** hold "restricted" or "research team only" data — anything in it is public. Therefore:
- The content repo is **private**. Only the *built static site* is public.
- The build **filters** records: only `visibility: public` **and** required consent `granted` render. Everything else is skipped, and the build fails loudly if a public record references a non-public one.
- Truly restricted or personal material (consent forms, raw survey responses, interviews, visit requests) is **never in this repo** — it lives in private university storage, referenced only by ID.

## Repo layout

```text
ccl-website/               (private, in a GitHub organisation with ≥ 2 owners)
├─ CLAUDE.md  README.md
├─ docs/
├─ content/
│  ├─ site/                stats.yaml (computed), partners.yaml, about.md
│  ├─ evidence/            EVIDENCE-REGISTER data (claims → sources)
│  ├─ districts/<slug>/    (slug = RESEARCH district)
│  │   ├─ district.yaml
│  │   └─ villages/<slug>/
│  │       ├─ village.yaml  index.{en,mr,hi}.md
│  │       ├─ people/ surveys/ species/ challenges/ solutions/ heritage/ media/ products/
│  │       └─ geo/*.geojson
│  └─ taxonomy/            research categories, species lists, climate indicators
├─ src/  layouts, components, pages, themes/, i18n/
├─ functions/              visit-request endpoint
├─ scripts/                validators, importers, image optimiser, Zenodo export
└─ public/
```

Adding a district = new folder in `content/districts/` + theme file in `src/themes/`. Adding a village = new folder. No template edits.
Statistics are computed at build time from the records.
Languages: English (`/`), Marathi (`/mr/`), Hindi (`/hi/`).
Performance: Home < 250 KB mobile; LCP < 2.5s on 4G; WCAG 2.2 AA.
