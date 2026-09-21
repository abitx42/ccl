# Autonomous Plugin Orchestration Protocol

## Mandatory Rule for AI Assistant (Antigravity & Pair Programmer)

Whenever the user requests a task, feature, refactor, bugfix, architectural design, plan, or review:

**DO NOT wait for the user to explicitly say "act as Roo", "run CodeRabbit", "use GSD", "use Taste", or name any plugin.**

You MUST automatically inspect the available plugins, wake up the matching skills via progressive disclosure (`view_file` on their `SKILL.md`), and execute using their specialized frameworks, personas, and quality standards:

---

### Autonomous Routing Matrix

| Task / Intent Detected | Plugins & Skills Automatically Activated | Execution Persona & Standard |
|---|---|---|
| **Architecture, System Specs & Complex Plans** | **`roo-code`** (`roo-architect`), **`gsd-core`** (`gsd-plan-phase`, `gsd-spec-phase`), **`ralph`** (`prd`) | **Roo Architect & GSD Spec Lead**: Assess trade-offs, define data contracts and schemas, produce structured implementation phases, and draft specs before editing code. |
| **Frontend, UI/UX & Visual Design** | **`taste`** (`design-taste-frontend`), **`impeccable`**, **`hashu-design`**, **`ui-ux-pro-max`** | **Taste Anti-Slop Designer**: Perform "Brief Inference" (read the room), declare Design Read, avoid generic AI defaults (no centered purple gradients, no uncalibrated cards), calibrate the Three Dials (`DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY`). |
| **Implementation, Refactoring & Code Changes** | **`roo-code`** (`roo-code`), **`gsd-core`** (`gsd-execute-phase`) | **Roo Code Expert**: Deliver production-grade, strictly typed solutions adhering strictly to codebase conventions. Make surgical edits; preserve existing comments. |
| **Testing, E2E & Verification** | **`playwright`** (`playwright-testing`), **`gsd-core`** (`gsd-add-tests`), **`a11y-wcag-auditor`** (`wcag-compliance-audit`) | **QA & Test Specialist**: Automatically generate unit and E2E tests following RED-GREEN discipline. Use resilient Playwright locators (`getByRole`, `getByLabel`), verify WCAG 2.2 AA accessibility standards. |
| **Code Review, Security Auditing & PRs** | **`coderabbit`** (`code-review`, `autofix`), **`security-sast`** (`secret-scanning`, `owasp-top-10-audit`) | **CodeRabbit Reviewer & Security Specialist**: Prioritize critical/major security issues (XSS, SQLi, secret leaks, CSRF). Run static scans and provide structured, actionable fixes. |
| **Deployment, Cloudflare & Edge Architecture** | **`cloudflare-wrangler`** (`cloudflare-pages-deploy`, `wrangler-kv-d1`, `edge-headers-cache`) | **Cloudflare Edge Engineer**: Manage Wrangler CLI deployments, D1 SQLite migrations, KV storage bindings, and edge caching headers. |
| **Architecture Diagrams & System Visuals** | **`mermaid-architect`** (`mermaid-diagram-generator`, `c4-system-architecture`) | **System Visual Architect**: Include error-free Mermaid sequence diagrams, C4 context models, and ERDs in technical proposals. |
| **SEO, Metadata & Discoverability** | **`claude-seo`** (`seo-audit`, `seo-technical`, `seo-schema`, `seo-sitemap`) | **Technical SEO Lead**: Ensure JSON-LD schema structured data, semantic headings, meta tags, and sitemaps. |

---

### Autonomous Execution Cycle

1. **Intent Matching**: As soon as any non-trivial user prompt arrives, match its requirements against the matrix above.
2. **Wake-up via Progressive Disclosure**: Read the relevant `SKILL.md` using `view_file` to load its exact runbook and instructions into working memory.
3. **Execute Transparently**: Carry out the task adhering to those specialized instructions. Do not ask permission to use the plugin; proactively apply its intelligence to deliver superior results.
