# Reference Content Mapping: Dhanu22092006/ccl-portal → abitx42/ccl

This document defines the exact field-by-field mapping of verified research data extracted from the reference repository into our existing Astro + Zod content architecture.

---

## Mapping Matrix

### Mapping 1: Mumbai Suburban District Overview
* **REFERENCE SOURCE**: `server/utils/seedData.js` (`ccls.find(slug => slug === 'juhu-moragaon')`)
* **EXTRACTED FACT**: Mumbai Suburban coastal district encompasses traditional Koliwada settlements, mangrove estuaries, intertidal fisheries, and high-density urban-marine climate interfaces.
* **TARGET CONTENT TYPE**: `districtSchema`
* **TARGET FILE**: `content/districts/mumbai-suburban/district.yaml`
* **PUBLIC PAGE OR COMPONENT**: `/districts/mumbai-suburban/`, District Selector cards on `/` and `#districts`
* **VALIDATION REQUIREMENT**: Zod `districtSchema` must pass validation; trilingual `{ en, mr, hi }` text required for name, tagline, alt, and highlights.

---

### Mapping 2: Juhu Moragaon Place Profile
* **REFERENCE SOURCE**: `server/utils/seedData.js` & `client/src/data/cclSectionContent.js`
* **EXTRACTED FACT**: Juhu Moragaon is an 800+ year-old coastal Koliwada situated at 19.1073°N, 72.8263°E, comprising 500+ Mangela Koli fishing families organized under the Juhu Moragaon Machhimar Vividha Karyakari Sahakari Sanstha Ltd.
* **TARGET CONTENT TYPE**: `villageSchema` (Place)
* **TARGET FILE**: `content/districts/mumbai-suburban/villages/juhu-moragaon/village.yaml`
* **PUBLIC PAGE OR COMPONENT**: `/districts/mumbai-suburban/villages/juhu-moragaon/`
* **VALIDATION REQUIREMENT**: Stable ID `PLC-0003`; coarse GPS precision to prevent sensitive habitat disclosure; verified evidence links (`EV-0003`, `EV-0004`, `EV-0005`).

---

### Mapping 3: Grey Mangrove (*Avicennia marina*) at Juhu Moragaon
* **REFERENCE SOURCE**: `client/src/data/cclSectionContent.js` (Mangroves section)
* **EXTRACTED FACT**: Grey Mangrove (*Avicennia marina*, local: 'टिल्लूर') forms critical estuarine fringe buffering Juhu Moragaon against tidal surges and providing crustacean nursery grounds.
* **TARGET CONTENT TYPE**: `speciesSchema`
* **TARGET FILE**: `content/districts/mumbai-suburban/villages/juhu-moragaon/species/SPE-0002.yaml`
* **PUBLIC PAGE OR COMPONENT**: Species section in `/districts/mumbai-suburban/villages/juhu-moragaon/` and aggregated district flora/fauna list.
* **VALIDATION REQUIREMENT**: Valid IUCN status code (`LC`); places array referencing `PLC-0003`; coarse GPS precision; evidence reference `EV-0005`.

---

### Mapping 4: Bombay Duck (*Harpadon nehereus* / 'Bombil') Fishery
* **REFERENCE SOURCE**: `client/src/data/cclSectionContent.js` (Fishing & Culture section)
* **EXTRACTED FACT**: Bombay Duck (*Harpadon nehereus*, local: 'बोंबील') is an indigenous indicator fishery central to Mangela Koli culture, harvested in inshore waters and preserved through traditional solar drying on raised bamboo scaffold racks (*valan*).
* **TARGET CONTENT TYPE**: `speciesSchema`
* **TARGET FILE**: `content/districts/mumbai-suburban/villages/juhu-moragaon/species/SPE-0003.yaml`
* **PUBLIC PAGE OR COMPONENT**: Species section in `/districts/mumbai-suburban/villages/juhu-moragaon/`.
* **VALIDATION REQUIREMENT**: Valid IUCN status code (`VU` or `DD`); places array referencing `PLC-0003`; evidence reference `EV-0004`.

---

### Mapping 5: Tidal Surges, Encroachment & Mangrove Buffer Degradation
* **REFERENCE SOURCE**: `server/utils/seedData.js` & `client/src/data/cclSectionContent.js` (Challenges and Environmental Threat sections)
* **EXTRACTED FACT**: Recurring high astronomical tides and coastal storm surges threaten shoreline dwellings. Coastal mangrove buffers face pressure from solid debris dumping, while traditional drying yards face urban encroachment.
* **TARGET CONTENT TYPE**: `challengeSchema`
* **TARGET FILE**: `content/districts/mumbai-suburban/villages/juhu-moragaon/challenges/CHL-0002.yaml`
* **PUBLIC PAGE OR COMPONENT**: Challenges and Interventions section in `/districts/mumbai-suburban/villages/juhu-moragaon/`.
* **VALIDATION REQUIREMENT**: Category `flooding`; place reference `PLC-0003`; includes community response intervention `INT-0002` (volunteer mangrove patrols and participatory waste monitoring); evidence links `EV-0004`, `EV-0005`.

---

### Mapping 6: Evidence Register Claims
* **REFERENCE SOURCE**: `client/src/data/cclSectionContent.js` & Maharashtra Fisheries Department regulatory records.
* **EXTRACTED FACTS**:
  1. Historical antiquity of Juhu Moragaon documented in 12th century *Mahikavatichi Bakhar*.
  2. Statutory Maharashtra annual monsoon fishing ban (June 1 - July 31) for marine ecosystem rejuvenation.
  3. Joint demarcation of Juhu Koliwada boundaries by Fisheries and Revenue Departments (2018).
* **TARGET CONTENT TYPE**: `evidenceSchema`
* **TARGET FILES**:
  - `content/evidence/EV-0003.yaml`
  - `content/evidence/EV-0004.yaml`
  - `content/evidence/EV-0005.yaml`
* **PUBLIC PAGE OR COMPONENT**: `/sources/` (Evidence Register page) and badge links on place/survey/challenge records.
* **VALIDATION REQUIREMENT**: Opaque ID regex `^EV-\d{4}$`; state `verified`; valid source types (`official_document`, `secondary_source`, `community_account`).
