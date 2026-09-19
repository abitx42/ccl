# 07 — Community Visits & Research Access

This is deliberately **not tourism**. Purposes offered: research, educational, documentary, community learning, cultural exchange, biodiversity study. People who want to visit a village must **ask first**. The site never publishes a way to just turn up, and never publishes exact village visit details until a request is approved.

## Flow

```text
Visitor reads "Visiting respectfully" + code of conduct
        │
        ▼
Fills request form (per district/village)  ──►  Auto-reply: "received, we'll reply within X days"
        │
        ▼
Stage 1: University review (project coordinator) — completeness, purpose, safety, fit
        │
        ▼
Stage 2: Community / local-authority review (gram panchayat or named liaison) — the community decides
        │
   ┌────┴─────┐
Approved   Declined / Needs changes
   │            │
   ▼            ▼
Email with dates, meeting point,   Polite email with reason or
guide, rules, emergency contact    alternative (virtual session, other date)
   │
   ▼
Post-visit feedback + record
```

## Review Tiers

1. **Standard**: Small educational or research visits, no publication.
2. **Enhanced**: Documentary, journalism, dissertation with publication, large groups, groups with minors.
3. **Commercial**: Any commercial filming, photography, or product use. Requires senior university approval and written benefit-sharing agreement with the community.

## Technical Design (Free Tier)

- Requests are **never stored in the public repo**.
- Handled via Cloudflare Worker + free key-value/database or Google Form → private Sheet.
- Verification and notification email templates in English, Marathi, and Hindi.
