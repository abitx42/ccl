# 11 — Data Lifecycle

Connects privacy (08), evidence (10), the content model (04) and architecture (03): where data lives at each stage, who moves it forward, and what must be true before it reaches the public.

## Pipeline

```text
COLLECT → INGEST → CLEAN → VERIFY → CONSENT → COMMUNITY REVIEW → PUBLISH → UPDATE → ARCHIVE
```

## Raw Data Rules

- Raw research data lives in private university storage, never in the git repo.
- Public records are aggregated and anonymized summaries only.
- Coarse precision is applied to sensitive locations before publication.
- Withdrawal requests trigger immediate removal on next build.
