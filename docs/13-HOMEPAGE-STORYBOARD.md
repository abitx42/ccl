# 13 — Cinematic Storyboard & Content Architecture

Status: **Proposed Master Specification (Phased Implementation)**  
Scope: Homepage narrative presentation layer, multi-tier Earth visualization, spatial choreography, and archive entry.

---

## 1. Architectural Principles & Rules of Engagement

1. **Research Data Isolation**: The 3D/2D Earth is strictly an aesthetic and spatial stage. Research data originates only from validated records in `/content/` via `public/geo/story-anchors.json`.
2. **Zero Fact Invention**: No fabricated heatmaps, no fake climate disasters, no unverified statistics (e.g. 820 students / 150 colleges withheld per Evidence Register #9), and no speculative district boundaries.
3. **Conservative Geography**:
   - Total district count is formally **unresolved** (conflict between 6 and 7 in Evidence Register #4).
   - Palghar is strictly designated as the **Technical / Reference Implementation**. Never "first district", "pilot", or "completed district".
4. **Native Scroll Preservation**: Zero scroll-jacking. `document.scrollTop` is 100% native. Easing and damping live exclusively in the render driver (`progress` chases `rawProgress`).
5. **Multi-Tier Degradation Matrix**:
   - **Tier 1 (WebGL Full)**: Physically plausible documentary Earth with subtle procedural clouds, atmospheric Rayleigh scattering, day/night terminator, and specular ocean response.
   - **Tier 2 (WebGL Mobile)**: Optimized geometry (lower segment count, 1024px procedural texture, no complex post-processing).
   - **Tier 3 (Canvas 2D Orthographic)**: `d3-geo` vector projection with rich natural terrain gradients, volumetric 3D solar lighting, and coastal bio-shield polygon.
   - **Tier 4 (Static Vector)**: Pure static SVG, zero JavaScript required, accessible semantic fallback.
6. **Automatic Performance Downgrade**:
   - Active FPS profiling during the first 90 frames.
   - If median frame time > 33ms (< 30 FPS), automatically downgrade Tier 1/2 → Tier 3 without UI flickering.
   - `IntersectionObserver` halts RAF polling completely when the story section is offscreen.

---

## 2. Eleven-Scene Cinematic Timeline & Information Hierarchy

Typography Pattern:
`[EYEBROW / CATEGORY]` (small, uppercase, tracking-wider, primary color)  
`[HEADLINE / STATEMENT]` (large, bold, 24–36px)  
`[EXPLANATION]` (2–3 concise sentences, verified factual tone, curious + serious)  
`[SPATIAL ACTION]` (subtle responsive element linked to the Earth)

```
───────────────────────────────────────────────────────────────────────────────
SCENE 01: EARTH — PROLOGUE
───────────────────────────────────────────────────────────────────────────────
Progress Range:   0.00 – 0.12
Earth Camera:     lat: 22.0°, lng: -24.0° (Mid-Atlantic global view), Scale: 1.00
Visual Accents:   Subtle continuous idle rotation. Atmospheric rim visible.
Eyebrow:          COOL CRYMB
Headline:         COmmunity cO-creation Lab for Local Climate Resilience
Body:             A bilateral research partnership between the University of Mumbai
                  and the University of Bristol, establishing grassroots field
                  laboratories to co-create practical climate solutions with coastal youth.
Sub-Note:         Supported by the British Council and HSBC under "Seeds for Transition India".

───────────────────────────────────────────────────────────────────────────────
SCENE 02: WHAT IS CCL? — THE CORE CONCEPT
───────────────────────────────────────────────────────────────────────────────
Progress Range:   0.13 – 0.24
Earth Camera:     lat: 30.0°, lng: -18.0°, Scale: 0.88, Offset X: +0.18
Visual Accents:   Earth eases slowly eastward. Ambient ocean glimmers under solar light.
Eyebrow:          What is CCL?
Headline:         A Living Bridge Between Communities and Climate Science
Body:             CCL is not an abstract climate campaign. It is a decentralized
                  incubator that pairs advanced academic modeling with generational
                  coastal knowledge, equipping youth with green skills to protect their homes.
Spatial Accent:   Concept triad emerges:
                  [ RESEARCH ] ─── [ YOUTH GREEN SKILLS ] ─── [ LOCAL ACTION ]

───────────────────────────────────────────────────────────────────────────────
SCENE 03: WHY DOES THIS MATTER? — THE MOTIVATION
───────────────────────────────────────────────────────────────────────────────
Progress Range:   0.25 – 0.36
Earth Camera:     lat: 38.0°, lng: -10.0°, Scale: 0.82, Offset X: +0.20
Visual Accents:   Earth rotates toward the Afro-Eurasian landmass. Natural terrain visible.
Eyebrow:          Why This Work Matters
Headline:         The Coastline Changes — Scientific Records Fall Behind
Body:             Rising seasonal tides, saltwater intrusion into drinking wells, and
                  estuarine erosion are reshaping coastal settlements. The shortage is not
                  concern — it is verifiable, date-stamped, hyper-local evidence.
Spatial Accent:   Curious + human + serious tone. Zero catastrophic disaster-imagery.

───────────────────────────────────────────────────────────────────────────────
SCENE 04: WHO ARE WE? — THE BILATERAL NETWORK
───────────────────────────────────────────────────────────────────────────────
Progress Range:   0.37 – 0.48
Earth Camera:     lat: 45.0°, lng: 15.0°, Scale: 0.76, Offset X: +0.20
Visual Accents:   Great-circle arc between Bristol and Mumbai illuminates in subtle gold.
Eyebrow:          Who We Are
Headline:         Two Coastal Cities. Two Universities. One Mission.
Body:             A formal international consortium linking the University of Bristol
                  in the United Kingdom and the University of Mumbai in India, funded
                  by HSBC through the British Council's Climate Skills India programme.
Spatial Accent:   Network Nodes:
                  University of Bristol (UK) ⇄ University of Mumbai (IN)

───────────────────────────────────────────────────────────────────────────────
SCENE 05: BRISTOL — THE UK PARTNER
───────────────────────────────────────────────────────────────────────────────
Progress Range:   0.49 – 0.58
Earth Camera:     lat: 51.46°, lng: -2.60° (Centred on Bristol), Scale: 0.82
Visual Accents:   Bristol geographic anchor illuminates. Great-circle arc originates here.
Eyebrow:          Geographic Anchor 01
Headline:         Bristol, United Kingdom
Body:             Drawing on Bristol's internationally recognized climate science
                  and urban adaptation research, faculty and scholars collaborate
                  on joint methodologies, risk models, and student training curricula.
Spatial Accent:   Anchor Marker: [ Bristol · University of Bristol ]

───────────────────────────────────────────────────────────────────────────────
SCENE 06: MUMBAI — THE OPERATIONAL LEAD
───────────────────────────────────────────────────────────────────────────────
Progress Range:   0.59 – 0.68
Earth Camera:     lat: 19.07°, lng: 72.87° (Centred on Mumbai), Scale: 0.84
Visual Accents:   Camera sweeps smoothly across the continent to Mumbai. Arc terminates.
Eyebrow:          Geographic Anchor 02
Headline:         Mumbai, India · CCCSS Kalina Campus
Body:             The operational headquarters are anchored at the Centre for Climate
                  Change and Sustainability Studies (CCCSS) at the University of Mumbai,
                  directing field research, ethics protocols, and community governance.
Spatial Accent:   Anchor Marker: [ Mumbai · University of Mumbai, CCCSS ]

───────────────────────────────────────────────────────────────────────────────
SCENE 07: FROM UNIVERSITY TO FIELD — THE EXTENSION
───────────────────────────────────────────────────────────────────────────────
Progress Range:   0.69 – 0.76
Earth Camera:     lat: 19.35°, lng: 72.90°, Scale: 1.05, Offset X: +0.16
Visual Accents:   Camera zooms into the Maharashtra coastal belt. Konkan greening illuminates.
Eyebrow:          From Campus to Coastline
Headline:         Taking Science Directly Into the Estuaries
Body:             Research does not stay in university lecture halls. Faculty and student
                  fellows travel directly into vulnerable fishing and farming hamlets,
                  working alongside local gram panchayats, elders, and youth cooperatives.
Spatial Accent:   Operational Path:
                  CAMPUS ──> FIELD LAB ──> COMMUNITY CO-DESIGN ──> PUBLIC ARCHIVE

───────────────────────────────────────────────────────────────────────────────
SCENE 08: HOW WE WORK — THE PARTICIPATORY LIFECYCLE
───────────────────────────────────────────────────────────────────────────────
Progress Range:   0.77 – 0.84
Earth Camera:     lat: 19.45°, lng: 72.92°, Scale: 1.18, Offset X: +0.16
Visual Accents:   Western Ghats & estuarine river drainage lines glow subtly.
Eyebrow:          Five-Step Methodology
Headline:         A Structured, Reproducible Co-Creation Pipeline
Body:             Every community lab follows a rigorous five-stage participatory model:
                  1. Field Targeting · 2. Community Profiling · 3. Social Cartography
                  4. Participatory Co-Design · 5. Implementation & Permanent Archiving.
Spatial Accent:   Interactive numbered lifecycle stages render alongside the terrain.

───────────────────────────────────────────────────────────────────────────────
SCENE 09: THE RESEARCH LANDSCAPE — AN EXPANDING ARCHIVE
───────────────────────────────────────────────────────────────────────────────
Progress Range:   0.85 – 0.91
Earth Camera:     lat: 19.55°, lng: 72.85°, Scale: 1.30, Offset X: +0.16
Visual Accents:   Held Maharashtra coastal view. Research categories appear as spatial tags.
Eyebrow:          The Research Landscape
Headline:         More Than a Website — A Permanent Open-Access Archive
Body:             Every observation is recorded as an immutable, verified data entity.
                  The public archive organizes research into eight interconnected domains:
Spatial Accent:   [ Places ] [ People ] [ Surveys ] [ Species ]
                  [ Challenges ] [ Responses ] [ Heritage ] [ Evidence ]

───────────────────────────────────────────────────────────────────────────────
SCENE 10: PALGHAR — TECHNICAL REFERENCE IMPLEMENTATION
───────────────────────────────────────────────────────────────────────────────
Progress Range:   0.92 – 0.97
Earth Camera:     lat: 19.70°, lng: 72.77° (Palghar Anchor), Scale: 1.45
Visual Accents:   Palghar anchor pin pulses gently. Estuarine wetlands highlighted.
Eyebrow:          Technical Reference Implementation
Headline:         Palghar Coastal Field Laboratory
Body:             Palghar serves as the platform's reference technical implementation,
                  documenting estuarine salinity dynamics, Warli agro-forestry techniques,
                  and community bio-shields along the Vaitarna river basin.
Badge:            Technical Reference Implementation (Confirmed Scope: Unresolved)

───────────────────────────────────────────────────────────────────────────────
SCENE 11: EXPLORE THE ARCHIVE — THE THRESHOLD
───────────────────────────────────────────────────────────────────────────────
Progress Range:   0.98 – 1.00
Earth Camera:     lat: 19.60°, lng: 72.80°, Scale: 1.35
Visual Accents:   Globe recedes smoothly; UI transitions naturally to research cartography.
Eyebrow:          Explore
Headline:         Navigate Verified Coastal Research
Body:             Explore published communities, verified evidence registers, community
                  contributions, and aggregated surveys.
Action CTA:       [ Explore Research Archive ↓ ]  [ Request Field Access → ]
───────────────────────────────────────────────────────────────────────────────
```

---

## 3. Earth Spatial & Mathematical Choreography Matrix

| Scene | Progress (`p`) | Target Lat | Target Lng | Scale (`s`) | Offset X (`ox`) | Offset Y (`oy`) | Narrative Focus |
|---|---|---|---|---|---|---|---|
| **01** | `0.00 – 0.12` | `22.0°` | `-24.0°` | `1.00` | `0.00` | `0.00` | Prologue & Mission |
| **02** | `0.13 – 0.24` | `30.0°` | `-18.0°` | `0.88` | `+0.18` | `0.00` | What is CCL? |
| **03** | `0.25 – 0.36` | `38.0°` | `-10.0°` | `0.82` | `+0.20` | `0.00` | Why This Matters |
| **04** | `0.37 – 0.48` | `45.0°` | `+15.0°` | `0.76` | `+0.20` | `0.00` | Bilateral Network |
| **05** | `0.49 – 0.58` | `51.46°`| `-2.60°` | `0.82` | `+0.18` | `0.00` | Bristol Anchor |
| **06** | `0.59 – 0.68` | `19.07°`| `+72.87°`| `0.84` | `+0.18` | `0.00` | Mumbai Anchor |
| **07** | `0.69 – 0.76` | `19.35°`| `+72.90°`| `1.05` | `+0.16` | `0.00` | Campus to Coast |
| **08** | `0.77 – 0.84` | `19.45°`| `+72.92°`| `1.18` | `+0.16` | `0.00` | 5-Step Methodology |
| **09** | `0.85 – 0.91` | `19.55°`| `+72.85°`| `1.30` | `+0.16` | `0.00` | Research Landscape |
| **10** | `0.92 – 0.97` | `19.70°`| `+72.77°`| `1.45` | `+0.16` | `0.00` | Palghar Reference |
| **11** | `0.98 – 1.00` | `19.60°`| `+72.80°`| `1.35` | `+0.16` | `0.00` | Explore Archive |

*On narrow screens (`< 860px`), `ox` is normalized to `0.0` and `oy` is set to `+0.16` to allocate comfortable vertical space for text cards.*

---

## 4. Multi-Tier Rendering Architecture

```
                                  [ User Device / Capability ]
                                                │
                 ┌──────────────────────────────┴──────────────────────────────┐
                 ▼                                                             ▼
     [ prefers-reduced-motion ]                                    [ Standard Motion ]
     [ saveData: true / No JS ]                                                │
                 │                                                             ▼
                 ▼                                                    [ WebGL Supported? ]
         { TIER 4: STATIC }                                                    │
         - Pure static SVG                                      ┌──────────────┴──────────────┐
         - Instant display                                      ▼                             ▼
         - Zero runtime cost                                  [ YES ]                        [ NO ]
                                                                │                             │
                                                     ┌──────────┴──────────┐                  ▼
                                                     ▼                     ▼          { TIER 3: 2D CANVAS }
                                            { TIER 1: WEBGL }     { TIER 2: WEBGL-M } - d3-geo orthographic
                                            - Desktop GPU         - Mobile GPU        - Volumetric shading
                                            - Realistic Shader    - 1024px Texture    - Natural terrain gradient
                                            - Cloud & Atmo        - Low Segments      - 0 extra dependencies
                                                     │                     │
                                                     └──────────┬──────────┘
                                                                │ (FPS < 30 Benchmark)
                                                                ▼
                                                    [ Auto-downgrade to Tier 3 ]
```

---

## 5. Procedural Nature Audio (Opt-In Ambient Coastal Layer)

- **Engine**: Pure Web Audio API procedural synthesis. Zero external audio file download (0 KB payload).
- **Acoustic Design**: Multi-layer filtered pink noise with resonant biquad filtering, modulated by an ultra-slow 0.08 Hz sine LFO (~12.5-second swell cycles) simulating Atlantic and Arabian Sea coastal surf.
- **Ethics & Policy**: Muted by default (`aria-pressed="false"`). Activated strictly via explicit user click. Automatically paused when out of view or tab inactive.

---

## 6. Phased Implementation Roadmap

- **Phase A — Story Architecture**: Implement the complete 11-scene HTML cards in `CCLStory.astro` across English, Marathi, and Hindi, adhering to verified facts and the Evidence Register.
- **Phase B — Multi-Tier Earth Engine**:
  - Add Three.js runtime for Tier 1/2 with procedural high-fidelity documentary texture, subtle atmospheric Rayleigh rim, directional sunlight, and rolling FPS downgrade.
  - Refine Tier 3 Canvas 2D and Tier 4 Static SVG so all tiers present identical narrative states.
- **Phase C — Damped Choreography Integration**: Connect the 11-scene keyframe matrix to the 260ms exponential smoothing driver with idle rotation blending.
- **Phase D — Micro-Interactions & Markers**: Project DOM-anchored labels for Bristol, Mumbai, and Palghar with responsive occlusion detection.
- **Phase E — Ambient Audio Integration**: Connect the opt-in Web Audio API coastal soundscape with smooth 1.2s fade-in / 0.8s fade-out.
- **Phase F — Cross-Device & Responsive QA**: Verify on desktop, Android (~360px), iPhone (~390px), landscape, and reduced-motion environments.
- **Phase G — Final Verification Suite & Git Push**: Run `npm run test`, `npm run lint`, `npm run build`, and push to `origin/main`.
