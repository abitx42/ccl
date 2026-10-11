# Reference Content Audit & Source Inventory Report

**Source Repository Audited:** `https://github.com/Dhanu22092006/ccl-portal`  
**Target Repository (Source of Truth):** `https://github.com/abitx42/ccl`  
**Audit Date:** October 2026  
**Auditor Mode:** ANALYZE → MAP → IMPLEMENT → VALIDATE  

---

## 1. Executive Summary

An exhaustive inspection of the reference repository `Dhanu22092006/ccl-portal` was conducted to discover factual information, research data, geographic parameters, and community documentation relevant to the Community Co-creation Lab (CCL) initiative.

### Key Findings
1. **Primary Data Sources**: All project content in the reference repository is contained in two core JavaScript files:
   - `server/utils/seedData.js` (32.5 KB) — defines CCL models, community narratives, and metric counters.
   - `client/src/data/cclSectionContent.js` (18.1 KB) — detailed socio-ecological narrative on Juhu Moragaon.
2. **Maturity Distribution**:
   - **Juhu Moragaon (Mumbai Suburban)** is the **only fully developed, content-rich field site** in the reference codebase, with concrete historical citations (*Mahikavatichi Bakhar*), documented livelihood structures (Mangela Koli cooperative), and ecological data.
   - **Thane (Solid Waste Management)** contains verified institutional partner collaborations (Stree Mukti Sanghatna, TMC).
   - **Nagaon (Murbad), Mahim-Kelve (Palghar), Ratnagiri/Raigad, and TBIA** are scaffolded placeholder sites marked as "Coming Soon", containing preliminary target projections rather than completed survey records.
3. **Design & Presentation**: Per non-negotiable project rules, **zero presentation code, CSS, component layouts, or visual assets** were copied. Only verified factual information has been inventoried and mapped into our existing Astro + Zod content architecture.

---

## 2. Detailed Content Categorization

### Category A: Project Overview Facts
- **Initiative**: Community Co-Creation Labs (CCL) for Local Climate Resilience / COOL CRYMB.
- **Bilateral Partners**: University of Mumbai (CCCSS, Kalina Campus) & University of Bristol, funded by the British Council and HSBC.
- **Participating Civic & Municipal Partners**:
  - Maharashtra Department of Fisheries
  - Thane Municipal Corporation (TMC)
  - Stree Mukti Sanghatna (Women waste-pickers cooperative)
  - Juhu Moragaon Machhimar Vividha Karyakari Sahakari Sanstha Ltd.

### Category B: Geographic Analysis
| CCL Slug | Administrative District | Specific Locality | Coordinates | Verification Status in Source |
|---|---|---|---|---|
| `juhu-moragaon` | Mumbai Suburban | Juhu Moragaon Koliwada (PIN 400049) | 19.1073°N, 72.8263°E | **Verified & Active** |
| `thane` | Thane | Thane City | 19.2183°N, 72.9781°E | **Verified & Active** |
| `nagaon-murbad` | Thane | Nagaon Village, Murbad Tehsil | 19.2579°N, 73.3986°E | Unverified (Planned / Coming Soon) |
| `mahim-kelve-palghar` | Palghar | Kelve / Mahim Coast | 19.6131°N, 72.7093°E | Unverified (Planned / Coming Soon) |
| `ratnagiri-raigad` | Ratnagiri / Raigad | Coastal Belt | 17.0005°N, 73.3119°E | Unverified (Planned / Coming Soon) |

### Category C: Community & People
- **Juhu Moragaon**:
  - 500+ Mangela Koli families.
  - Institutional anchor: *Juhu Moragaon Machhimar Vividha Karyakari Sahakari Sanstha Ltd.*
  - Gendered livelihood dynamics: Men navigate marine craft; women command dock auctions, fish processing (cleaning, sorting, salted sun-drying on bamboo scaffolds), and retail markets.
  - **Privacy & Consent Note**: No individual private citizen names or unconsented photos appear in the reference repo. Institutional bodies and collective roles are used throughout, aligning with our strict consent standards (`docs/08-PRIVACY-CONSENT-ETHICS.md`).

### Category D: Surveys & Field Research
- In the reference repository, the survey database schema (`server/models/Survey.js`) is architected with fields for `cclSlug`, `keyFindings[]`, and raw data payloads, but **no raw CSV/JSON dataset is populated**.
- Factual research parameters documented include the statutory **annual monsoon fishing ban** (June 1 to July 31) under the Maharashtra Marine Fishing Regulation Act, which provides fish stock regeneration.

### Category E: Biodiversity & Indicator Species
1. **Grey Mangrove (*Avicennia marina*)**:
   - Coastal estuarine bio-shield and tidal buffer.
2. **Bombay Duck (*Harpadon nehereus* / 'Bombil')**:
   - Staple fishery of the Konkan and Mumbai Koliwadas, sun-dried on traditional bamboo drying racks (*valan*).
3. **Estuarine Fauna & Avifauna**:
   - Intertidal mudflats support crabs, juvenile prawns/shrimps, and foraging wetland birds (little egrets, reef herons, white-throated kingfishers).

### Category F & G: Challenges, Interventions & Outcomes
1. **Coastal Erosion & Tidal Inundation**:
   - Increasing monsoon spring-tide surges threaten low-lying Koliwada settlements.
   - Debris dumping impairs mangrove nursery functions.
2. **Community Bio-Shield Defence**:
   - Fisherfolk collectives organize volunteer surveillance against mangrove dumping.
   - Demarcation of traditional village commons under CRZ Notification 2011 to protect drying yards and net repairs.

---

## 3. Discrepancy & Exclusion Register

| Reference Claim | Status | Action Taken & Rationale |
|---|---|---|
| "50+ petroglyphs documented in Kelve" | Ambiguous / Projected | **Excluded from production records**. Documented petroglyph clusters in coastal Maharashtra are primarily recorded on laterite plateaus in Ratnagiri/Rajapur, not Kelve sandbars. Requires independent archaeological citation. |
| "200+ plant species / 15 traditional healers in Ratnagiri" | Unverified Projection | **Excluded from production records**. No PBR sheets or healer consent records exist in the repository. |
| "admin@ccl-portal.org / Admin@123" | Security Vulnerability | **Flagged & Ignored**. Hardcoded credentials from reference repo must never enter our repository. |
| "500+ surveys completed in Thane" | Aggregate Metric without Raw Data | Retained as narrative project context, but excluded from strict verified survey counts (`stats.json`) until survey instruments and sample sizes are validated. |

---

## 4. Recommendations for Integration into Our System

1. **New District**: Add `mumbai-suburban` district record (`content/districts/mumbai-suburban/district.yaml`) featuring coastal marine resilience, Koliwada agro-marine livelihoods, and estuarine mangrove dynamics.
2. **New Place**: Add `juhu-moragaon` place record (`content/districts/mumbai-suburban/villages/juhu-moragaon/village.yaml`) using the stable ID `PLC-0003`.
3. **Species Records**:
   - Grey Mangrove (`SPE-0002`) observed at Juhu Moragaon mudflats.
   - Bombay Duck / Bombil (`SPE-0003`) regional fishery indicator.
4. **Environmental Challenge**:
   - Coastal erosion and mangrove habitat encroachment (`CHL-0002`).
5. **Evidence Register Additions**:
   - `EV-0003`: Historical settlement record (*Mahikavatichi Bakhar*, 12th Century).
   - `EV-0004`: Statutory monsoon fishing ban notification (Department of Fisheries, Maharashtra).
   - `EV-0005`: Fisheries and Revenue Department joint demarcation of Koliwada boundaries (2018).
