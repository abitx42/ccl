# 13 — Homepage Storyboard & Motion Architecture

Status: **Approved for Tier 3/4 Implementation (Three.js Tier 1/2 withheld pending Tier 3 measurement)**.
Scope: Homepage narrative presentation layer.

## Core Rules

1. **Isolation**: The globe is a presentation layer consuming only `public/geo/story-anchors.json`. If `src/components/story/` is deleted tomorrow, the entire site must remain a complete, beautiful, accessible, and functional research archive.
2. **Static-First (Tier 4 / No-JS)**: The full HTML structure (B0 through B9) renders on the server and works completely with JavaScript and WebGL disabled.
3. **Sequential Lighting vs Zoom**: After the initial camera transition from UK/Bristol to Mumbai, the camera zooms out to a held view of the coastal Maharashtra region where districts light up sequentially. No nauseating push-pull camera loops.
4. **No Literal Data Streams**: The bilateral partnership is denoted as an elegant static great-circle connection without animated flying particles.
5. **Capability-Measured Rendering**:
   - Tier 4: `prefers-reduced-motion: reduce`, `saveData: true`, or no JS.
   - Tier 3: 2D Canvas with `d3-geo` orthographic projection and simplified world TopoJSON (~30 KB).
   - Tier 1/2: Deferred WebGL/Three.js (held until Tier 3 is measured).
6. **Data-Driven Anchors**: `story-anchors.json` contains only verified geographic presentation data: zero PII, zero unconsented data, zero findings.
7. **Accessibility & Skip Link**: Prominent "Skip introduction → Explore research" link right at the top jumping directly to `#districts`. Real HTML `<a href="...">` links for district cards.
