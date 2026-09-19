# CLAUDE.md — Working agreement for AI assistants in this repo

## Project

Public website for the University of Mumbai's COOL CRYMB / CCL climate-resilience research.
Read `README.md` and everything in `docs/` before making changes. If code and docs disagree,
ask, then update the docs.

## Stack (see docs/03-ARCHITECTURE.md)

Zero-budget, free-tool stack: Astro + TypeScript, content in `/content` (Markdown/MDX + YAML,
validated with Zod), Cloudflare Pages, Decap CMS, Pagefind, MapLibre + GeoJSON/PMTiles,
Worker/Form for visit requests. The marketplace is a separate system, enquiry-only for now.
The repo is **private**; only the built static site is public.

## Hard rules

0. **Check `docs/10-EVIDENCE-REGISTER.md`.** Don't publish anything below *Verified* status. The district count (6 vs 7) is unresolved: never hard-code it.
1. **Never invent facts, numbers, names, species, dates or quotes.** Content comes only from
   files in `/content` provided by the team. Use clearly marked placeholders
   (`TODO(content): ...`) when something is missing.
2. **Consent gating is mandatory.** Do not render a Person, photo or video showing people
   unless the consent fields in the schema are satisfied. Never weaken this check to make a page "look complete".
3. **Never put personal or restricted data in the repo** (consent forms, phone numbers, raw survey responses, interviews, visit requests, anything not `visibility: public`).
3a. **IDs are opaque and permanent** (`PLC-0001`, `PRJ-0001`, `EV-0001`). Never encode a district in an ID. The site follows a place's *research district* (`project.research_district`), which is separate from its administrative district. Surveys, challenges and responses belong to a **Project** and reference places.
3b. **Every record carries the common block** (`id`, `status`, `visibility`, `verification`, `evidence`) and, where relevant, `consent` (doc 04). Statistics are computed from records, never typed.
4. **Sensitive locations** use the coarse-precision rules in docs/04 and docs/08.
5. **Every user-facing string exists in en/mr/hi** (or falls back to English with the visible fallback notice). No hard-coded text in components.
6. **Themes only change tokens/motifs**, never structure or accessibility behaviour (docs/05).
7. **Don't add dependencies casually.** Prefer the platform; justify any new package in the PR description.
8. **Mandatory AI Collaboration Log & Git Push**: Any AI assistant MUST update Section 5 of `README.md` (recording user prompt, walkthrough, files modified, verification results) on EVERY response, pass `npm run test`, `npm run lint`, and `npm run build`, and `git push origin main`.

## Conventions

- TypeScript strict. Components in `src/components`, one theme per district in `src/themes`.
- Adding a district = new folder in `content/districts/` + new theme file; no template edits.
- Images through the Astro image pipeline; alt text required.
- Commits: small, imperative ("Add district selector cards"). PRs describe what changed and how to check it.
- Accessibility: keyboard, focus, contrast, reduced motion — check on every UI change.

## Commands

```bash
npm run dev          # local dev server
npm run build        # production build (runs content validation)
npm run validate     # content schemas + consent + translation checks
npm run lint
npm run test
```

## Definition of done

- Builds with no validation errors; Lighthouse accessibility ≥ 95 on changed pages.
- Works at 360 px width and with keyboard only.
- Marathi/Hindi text renders correctly (Devanagari font, no clipped diacritics).
- Docs updated if behaviour or structure changed.

## When unsure

Ask the project owner. Questions about consent, sensitive places, money, or community
representation are **never** resolved by guessing.
