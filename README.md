# CCL Website — Community Co-creation Lab for Local Climate Resilience

Long-term public research archive and spatial cartography atlas for the University of Mumbai's **COOL CRYMB** project (**COmmunity cO-creation lab for Local Climate Resilience: empowering Youth with green skills in Mumbai and Bristol**), conducted in bilateral partnership between the **University of Mumbai** and the **University of Bristol**, funded by the **British Council** and **HSBC**.

- **Technical Implementation Reference:** Palghar Coastal Field Laboratory  
- **Project Research Scope:** Formally unresolved pending academic consortium verification (see [`docs/10-EVIDENCE-REGISTER.md`](docs/10-EVIDENCE-REGISTER.md))  
- **Hosting & Infrastructure:** Zero-budget, deployment-agnostic static architecture (primary target: Cloudflare Pages / Workers) with permanent Zenodo DOI archival snapshots  
- **Accessibility Target:** WCAG 2.2 Level AA compliance, trilingual support (English, मराठी, हिन्दी), accessible without JavaScript (Tier 4 static vector fallback)  

---

## 1. Project Concept & Big Idea

### What is CCL?
The **Community Co-creation Lab (CCL)** is an applied climate-resilience research initiative bridging university climate scientists, local coastal communities, and youth fellows. 

Coastal Maharashtra is experiencing accelerated climate vulnerabilities:
- High-tide marine inundation and saline water intrusion into freshwater wells and paddy fields
- Severe estuarine and riverbank erosion threatening coastal settlements
- Mangrove degradation and loss of coastal bio-shields
- Traditional agro-ecological systems under environmental stress

While academic researchers produce macro-scale climate models and policy recommendations, coastal communities have preserved generations of experiential ecological observations. CCL creates a structured, bilateral mechanism to:
1. **Empower youth fellows** with practical green skills (biodiversity profiling, GPS surveying, water salinity testing, oral history collection).
2. **Co-create hyper-local interventions** (mangrove restoration, tidal bund engineering, indigenous salinity-resistant seed preservation, sustainable aquaculture).
3. **Archive verified field evidence** into an open, permanent, and ethically governed public repository.

### The Platform's Dual Architectural Function
1. **Interactive Cinematic Documentary (Homepage Opening)**:
   A visual narrative that transports the visitor from a global planetary perspective to bilateral academic centers (Bristol & Mumbai), through Maharashtra's coastal geography, and directly into the field laboratories. It establishes *what* the project is, *why* it exists, *who* is involved, and *how* the methodology operates before opening the archive.
2. **Permanent Evidence-Led Research Archive & Atlas**:
   An immutable, structured, static repository containing verified places (`PLC-*`), community contributors (`PPL-*`), aggregated surveys, species observations, environmental challenges, community responses, and oral history quotes.

---

## 2. Technical Architecture & Performance Innovations

### Multi-Tier Living Earth System
The spatial narrator uses an adaptive four-tier progressive enhancement architecture that ensures a cinematic experience on high-end hardware while guaranteeing complete functional accessibility on low-spec mobile devices or slow networks:

- **Tier 1 (WebGL Desktop)**: Physically plausible 3D Earth powered by Three.js with a 2048px procedural satellite texture, natural vegetation gradients, atmospheric Rayleigh scattering rim shader, directional sunlight with a realistic day/night terminator, and a subtle rotating cloud shell.
- **Tier 2 (WebGL Mobile)**: Optimized geometry and 1024px procedural texture designed for mobile GPUs and thermal safety.
- **Tier 3 (Canvas 2D Orthographic)**: Mathematical orthographic vector projection using `d3-geo` with natural terrain gradients, volumetric 3D solar lighting, and coastal bio-shield polygons. Operates at a rock-solid 60 FPS with zero WebGL dependencies.
- **Tier 4 (Static Vector Fallback)**: Pure static SVG rendered at build time, requiring zero JavaScript. Serves as the accessible semantic fallback for users with `prefers-reduced-motion: reduce`, `saveData: true`, or legacy devices.
- **Rolling 90-Frame Automatic Downgrade Guard**: An active performance monitor benchmarks the first 90 animation frames. If the median frame time exceeds 33.3ms (< 30 FPS), the engine automatically disposes WebGL and transitions seamlessly to Tier 3 Canvas 2D without visual disruption or page reloads.
- **Dynamic Code-Splitting**: Three.js and `GlobeWebGL.ts` are dynamically loaded via `import()` on demand. The initial page bundle is strictly **38.76 kB (14.70 kB gzipped)**. Devices on Tier 3 or Tier 4 never fetch Three.js.

### Damped Follow Scroll Physics (Zero Scroll-Jacking)
- **100% Native Page Scrolling**: `document.scrollTop` is never hijacked or intercepted. Keyboard navigation (`PageDown`, `End`, arrow keys), mouse wheels, touchpad flings, and assistive tools operate natively.
- **Exponential Smoothing Driver**: Visual rendering glides toward native scroll position using a **260ms time constant** (`SMOOTH_MS = 260`), providing natural momentum and drift.
- **Continuous Idle Drift**: Subtle rotational drift (`+0.00015` rad/frame) keeps the Earth alive when the user pauses scrolling.
- **`IntersectionObserver` Auto-Sleep**: Halts RAF polling completely when the story container scrolls out of view, consuming 0 CPU frames when idle.

### Zero-Byte Ambient Coastal Audio
- **Procedural Synthesizer**: Generates gentle rolling coastal surf and sea breeze using the Web Audio API (pink noise buffer modulated by an ultra-slow 0.08 Hz sine LFO simulating ~12.5-second wave swells).
- **0 KB Asset Download**: 100% client-side synthesis. Zero audio files, zero network requests, offline-ready.
- **Strictly Opt-In**: Muted by default with an accessible button (`🌊 Ambient Sound: Off / On`). Automatically pauses when scrolling away or switching tabs.

### Eleven-Scene Cinematic Storyboard
Each scene follows a strict **`[EYEBROW]` → `[LARGE HEADLINE]` → `[2–3 LINE VERIFIED EXPLANATION]` → `[SPATIAL ACCENT]`** hierarchy across English, Marathi, and Hindi:
1. **Scene 01: Prologue / Earth** — COOL CRYMB bilateral initiative overview.
2. **Scene 02: What is CCL?** — Living bridge between communities, youth green skills, and science.
3. **Scene 03: Why This Work Matters** — Coastline changes, scientific records fall behind; traceable evidence.
4. **Scene 04: Who We Are** — Bristol and Mumbai bilateral consortium funded by British Council & HSBC.
5. **Scene 05: Bristol (UK)** — Collaborative research partner in climate modeling and urban adaptation.
6. **Scene 06: Mumbai (IN)** — Operational headquarters at CCCSS Kalina Campus.
7. **Scene 07: Campus to Coastline** — Moving science directly into vulnerable estuarine hamlets.
8. **Scene 08: Five-Step Methodology** — Targeting → Profiling → Mapping → Co-Design → Archiving.
9. **Scene 09: The Research Landscape** — Eight archive domains (Places, People, Surveys, Species, Challenges, Responses, Heritage, Evidence).
10. **Scene 10: Palghar (Technical Reference)** — Estuarine salinity dynamics and Warli agro-forestry.
11. **Scene 11: Explore the Archive** — Direct threshold to research cartography and visit requests.

---

## 3. Documentation Index

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
- [`docs/13-HOMEPAGE-STORYBOARD.md`](docs/13-HOMEPAGE-STORYBOARD.md) — 11-Scene cinematic storyboard and multi-tier Living Earth specification
- [`CLAUDE.md`](CLAUDE.md) — Working agreement and hard rules for AI coding assistants

---

## 4. Ground Rules & Research Integrity

1. **Evidence-Led Verification**: Facts come exclusively from the team's verified records in `/content/evidence/` tracked in [`docs/10-EVIDENCE-REGISTER.md`](docs/10-EVIDENCE-REGISTER.md). AI summaries are never evidence sources.
2. **Zero Fact Invention**: Never invent facts, numbers, names, species, dates, or quotes. Speculative climate heatmaps, disaster flooding overlays, or unverified student counts (e.g. 820 students / 150 colleges withheld per Evidence Register #9) are strictly prohibited.
3. **Conservative Geography & Terminology**:
   - Total project research districts count is formally **unresolved** (conflict between 6 and 7 districts). Never hard-code it.
   - Palghar is strictly badged as the **Technical / Reference Implementation**. Never use "pilot", "first district", "1 district researched", or "completed district".
   - The UI must gracefully handle **zero confirmed project districts** without layout breakage.
4. **Consent Gating**: No person profile, photo, or oral quote is published without verified consent (`consent.state === 'granted'`) and specific scope (`'name'`, `'photo'`, `'quote'`).
5. **Dynamic Computed Stats**: All statistics on the public site are computed at build time by [`scripts/validate-content.ts`](scripts/validate-content.ts) into `content/site/stats.json`. Never type numbers manually.
6. **Git Synchronization**: Always commit and push all code changes to GitHub `origin/main` after every change.

---

## 5. Instructions for AI Assistants (AI Collaboration Log)

> [!IMPORTANT]
> **Mandatory AI Working Protocol**:
> Any AI agent (Antigravity, Claude, Gemini, Cursor, ChatGPT, etc.) working on this repository **MUST** adhere to this protocol:
> 1. **Read this section** and [`CLAUDE.md`](CLAUDE.md) before proposing or executing code changes.
> 2. **Never violate Ground Rules** (no fact invention, strict consent gating, conservative terminology, zero scroll-jacking).
> 3. **Run the Pre-Commit Verification Checklist** and ensure 100% pass rate.
> 4. **Update the Chronicle of AI Prompts & Walkthroughs below on EVERY response** where modifications occur, logging the prompt, technical rationale, modified files, verification results, and commit hash.
> 5. **Always commit and push to Git (`git push origin main`)** at the completion of your response.

### Pre-Commit Verification Checklist
Run these commands in order and verify **zero errors**:
```bash
npm run validate   # Validates content schemas, consent gates, and generates story-anchors.json
npm run test       # Executes validate + adversarial test suite (10 negative edge cases)
npm run lint       # astro check (must report 0 errors, 0 warnings, 0 hints)
npm run build      # Static production build
git status         # Verify clean tree, stage all changes, commit, and git push origin main
```

---

### Chronicle of AI Prompts & Walkthroughs

#### Session 1: Architecture, Free-Tool Stack & Evidence Register
- **User Prompt**: Establish zero-budget public research archive for University of Mumbai's COOL CRYMB / CCL project. Evaluate Cloudflare vs Antideploy. Ensure restricted data never sits in the static build; link claims to evidence; handle unresolved district count (6 vs 7).
- **Walkthrough**:
  - Implemented static Astro architecture hosted on Cloudflare with Zenodo DOI archival snapshots.
  - Authored foundational documentation (`docs/01` to `docs/12`).
  - Created [`docs/10-EVIDENCE-REGISTER.md`](docs/10-EVIDENCE-REGISTER.md) classifying claims as Verified, Researcher-Provided, User-Provided, Inference, or Placeholder.
  - Banned hardcoding the district count; created automated stats computation.

#### Session 2: Centralized Reusable People Entity & Consent Gating
- **User Prompt**: People must be a reusable data entity (`content/people/PPL-xxxx.yaml`). Do not hardcode people into village pages. Support 1 to 100+ contributors without modifying code. Flexible real-world roles, photo consent gating, and village references to stable IDs.
- **Walkthrough**:
  - Implemented `personSchema` in [`src/schemas/index.ts`](src/schemas/index.ts) with `id`, `name`, `role`, `community`, `consent`, `evidence`.
  - Added strict photo consent gating: if `photo` is specified, `consent.scope` must contain `'photo'`.
  - Added village mapping: `village.people: ["PPL-0001"]`.

#### Session 3: Places Terminology & Cross-Community Contributions
- **User Prompt**: Fix terminology around `places`. `PLC-*` represents Place/Community IDs, not "village IDs". Support cross-district/cross-village people (`person.places: ["PLC-*"]`) for faculty, master trainers, and researchers. Strictly designate Palghar as technical reference implementation; confirmed district count unresolved.
- **Walkthrough**:
  - Updated schemas to use `placeSchema = villageSchema` alias and `places: z.array(z.string()).optional()` on Person records.
  - Refactored [`scripts/validate-content.ts`](scripts/validate-content.ts) to validate bi-directional referential integrity between People and Places.
  - Purged misleading terms ("pilot", "first district"). Updated badges to `Technical Reference Implementation`.

#### Session 4: Contextual Quotes & Adversarial Validation Suite
- **User Prompt**: Quotes must be contextual and attached directly where used (`challenge.quotes`, `intervention.quote`, `village.quotes`). Support single language text, attribution role, independent consent, and attribution consistency check. Implement automated adversarial validation test suite testing 10 negative cases. Ensure graceful fallback for zero confirmed districts.
- **Walkthrough**:
  - Implemented `quoteTextSchema` and `quoteSchema` with contextual attribution, consent, and evidence.
  - Added attribution consistency check in validation script: quotes citing `contributor: PPL-0001` must match the canonical name in `PPL-0001.yaml` to prevent silent misattribution.
  - Created [`scripts/test-adversarial-validation.ts`](scripts/test-adversarial-validation.ts) covering 10 negative adversarial vectors (missing place IDs, missing person IDs, unconsented photos, pending quotes, attribution mismatch, withdrawn consent, unverified evidence filtering, visibility leaks). All 10 tests passed.
  - Added graceful fallback banner in [`src/pages/index.astro`](src/pages/index.astro) when `districts.length === 0`.

#### Session 5: Damped Follow Physics, Living Earth & 11-Scene Documentary
- **User Prompt**: Implement buttery-smooth cinematic scroll physics using a persistent exponential smoothing driver (`rawProgress` vs `progress`, 260ms time constant) without scroll-jacking. Make Earth feel alive with natural satellite shading, atmospheric limb glow, directional sunlight, and coastal greenery. Deepen narrative into an 11-scene interactive documentary explaining: What is CCL? Why does it exist? Who is involved? How do we work? What is inside the archive? Add opt-in procedural coastal nature audio.
- **Walkthrough**:
  - Created [`src/components/story/StoryTypes.ts`](src/components/story/StoryTypes.ts) and [`docs/13-HOMEPAGE-STORYBOARD.md`](docs/13-HOMEPAGE-STORYBOARD.md) detailing the 11-scene timeline and choreography keys.
  - Created [`src/components/story/GlobeWebGL.ts`](src/components/story/GlobeWebGL.ts) (Tier 1 & Tier 2 WebGL Living Earth) with procedural natural satellite texture, atmospheric Rayleigh scattering shader, directional sunlight day/night terminator, rotating cloud shell, and rolling 90-frame FPS benchmark with automatic fallback to Tier 3.
  - Updated [`src/components/story/GlobeCanvas2D.ts`](src/components/story/GlobeCanvas2D.ts) (Tier 3) with matching natural terrain palette, volumetric 3D solar lighting, and coastal bio-shield polygon.
  - Updated [`src/components/story/StoryStatic.astro`](src/components/story/StoryStatic.astro) (Tier 4) matching the green terrain and atmospheric styling.
  - Code-split Three.js via dynamic `await import('./GlobeWebGL')` in [`src/components/story/CCLStory.astro`](src/components/story/CCLStory.astro). Initial bundle is strictly **38.76 kB (14.70 kB gzipped)**.
  - Created [`src/components/story/AmbientAudio.ts`](src/components/story/AmbientAudio.ts) providing a zero-byte Web Audio API procedural coastal surf synthesizer with opt-in user controls.
  - Implemented the full 11-scene documentary narrative in English, Marathi, and Hindi.
  - Verified all tests, linting, and production builds. Pushed to `origin/main` (commit `d29c85a`).

#### Session 6: Documentation Overhaul, AI Chronicle Protocol & Git Push Verification
- **User Prompt**: "pushed to git ? and also in read me update all the idea and make one more section for other ai agents that would have all my promts and ur updated walkthrough on evry response this must be updated"
- **Walkthrough**:
  - Verified remote repository synchronization: Commit `d29c85a` confirmed pushed to `origin/main`.
  - Thoroughly restructured and expanded [`README.md`](README.md) with complete project context, scientific motivations, four-tier Living Earth graphics architecture, damped follow physics, zero-byte procedural audio, and documentation map.
  - Created dedicated Section 5 for **AI Assistants (AI Collaboration Log)** establishing the mandatory protocol, pre-commit checklist, and chronological prompt/walkthrough ledger.
  - Updated [`CLAUDE.md`](CLAUDE.md) rule 8 mandating future AI assistants maintain the chronicle and push to Git on every response.
  - Verified full test suite (`npm run test`), linting (`npm run lint`), and static build (`npm run build`).
  - Staged, committed, and pushed all updates to GitHub `origin/main`.
