# 06 — Store (E-Commerce)

There is no funding today, and every credible store needs paid hosting, payment fees, and someone to run orders. So only **Phase A (enquiry catalogue)** is planned for the free-tool period. Phases B and C wait for a seller, hosting and a named operator. Nothing on the public site should promise "buy now" before then.

## Phased Approach

- **Phase A (Current)**: Enquiry catalogue only. Products show maker, story, sustainability provenance, photos, and an "Enquire / Express Interest" button.
- **Phase B (Funded)**: Hosted open-source store (e.g. Medusa or WooCommerce) supporting INR, UPI, GST compliance.
- **Phase C**: Deep integration and revenue-sharing management with village SHGs.

## Product Record Specification

Lives in `content/districts/[slug]/products/*.yaml`:
- Common block (`id`, `status`, `visibility`, `verification`, `evidence`)
- Product name (`en`, `mr`, `hi`)
- Maker details (consent-gated)
- Provenance story
- Status: `enquiry_only | available | out_of_stock`
- External store / enquiry URL
