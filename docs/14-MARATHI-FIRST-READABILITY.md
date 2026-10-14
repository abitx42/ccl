# 14 — Marathi-first Storytelling & Readability Map

Status: **Implemented in the Astro homepage and archive routes**

Audience: Marathi-speaking villagers, farmers, local representatives, community members, and visitors who may not be comfortable with technical English.

## Editorial guardrails

- Write in clear, broadly understandable Marathi. Keep proper names, acronyms, record IDs, scientific names, and units unchanged where they are identifiers.
- Separate the platform's proposed working method from published field evidence. The five-step method is a project/storyboard plan, not proof that every place completed every step.
- Do not present the unresolved project-wide district count as a confirmed statistic.
- Palghar is described only as a **technical reference implementation**, never as a pilot, first district, or completed district.
- Use `दस्तऐवजी नोंद` for a documented source and `समुदायाचा अनुभव` for an oral/community account.

## Scene content map

| Scene | Marathi heading / copy direction | Evidence or source boundary | Reveal / line-length intent |
|---|---|---|---|
| 01 · Opening | **स्थानिक बदल समजून घेण्यासाठी एकत्रित नोंद**. CCL/COOL CRYMB हा स्थानिक हवामान लवचिकतेशी संबंधित संशोधन उपक्रम आहे. | Partnership language is kept as project-context language; the partner register is researcher-provided, not independently verified. | Two short sentences; visible immediately; 45–60 Marathi characters per mobile line where possible. |
| 02 · CCL | **समुदाय, युवक आणि अभ्यास यांना जोडणारा उपक्रम**. विद्यापीठीय अभ्यास, युवकांचे हरित कौशल्य आणि स्थानिक अनुभव यांना जोडण्याचा आराखडा. | Project PRD and storyboard; not a claim that every community has completed this process. | Heading plus one short paragraph and three chips. |
| 03 · Why | **स्थानिक बदलांची नोंद आवश्यक आहे**. वैतरणा खोऱ्यात उच्च भरतीच्या वेळी खारे पाणी शिरते; उपलब्ध नोंदी या बदलाचा अभ्यासाशी संबंध दाखवतात. | EV-0001 and SUR-0001. Do not generalise to all Maharashtra coasts or drinking wells. | One fact-led paragraph plus a compact evidence label. |
| 04 · Partners | **संशोधनातील संस्थात्मक भागीदार**. Project records connect CCL with Mumbai University, Bristol, British Council, and HSBC; partnership status remains labelled as researcher-provided. | Evidence Register #3. | Four concise partner labels; no unsupported funding-role claim. |
| 05 · Bristol | **ब्रिस्टल विद्यापीठ**. नोंदींमध्ये संशोधन भागीदार म्हणून उल्लेख; विशिष्ट भूमिका स्वतंत्रपणे स्पष्ट होईपर्यंत वर्णन मर्यादित. | Evidence Register #3; avoid “UK Research Lead” and unsupported climate-science leadership claims. | One paragraph, no dense institutional jargon. |
| 06 · Mumbai | **मुंबई विद्यापीठ आणि CCCSS**. CCL च्या संस्थात्मक संदर्भात नमूद; क्षेत्रीय संचालनाची व्यापक भूमिका स्वतंत्र पुराव्याशिवाय दावा करू नये. | Project content and evidence boundaries. | One paragraph and a short context label. |
| 07 · Field | **क्षेत्रीय अभ्यास आणि समुदायाचा अनुभव**. मनोर, पालघर येथे पाणी आणि मातीच्या क्षारतेचा एकत्रित सर्वेक्षण रेकॉर्ड उपलब्ध आहे. | PLC-0002, SUR-0001, EV-0001, EV-0002. | Four-step visual flow with concise labels. |
| 08 · Method | **अभ्यासाची पाच पावले**: क्षेत्र निवड, समुदायाशी संवाद, स्थानिक नकाशीकरण, सह-रचना, नोंद व सार्वजनिक संग्रह. | Storyboard/PRD method; explicitly labelled as a platform approach. | Numbered rows; descriptions kept to one sentence each. |
| 09 · Archive | **प्रकाशित आणि सत्यापित संशोधन संग्रह**. ठिकाणे, समुदाय, सर्वेक्षणे, जैवविविधता, आव्हाने, प्रतिसाद, वारसा आणि पुरावे. | Only public records are shown; empty or incomplete domains stay honest. | Eight compact labels; no claim that all are populated. |
| 10 · Palghar | **पालघर · तांत्रिक संदर्भ अंमलबजावणी**. उपलब्ध नोंदी वैतरणा खोऱ्यातील खाऱ्या पाण्याचा शिरकाव आणि नैसर्गिक वनस्पतीयुक्त बांधांची माहिती देतात. | EV-0001 and EV-0002; no pilot/first/completed-district language. | Badge plus two short sentences. |
| 11 · Archive entry | **सत्यापित किनारपट्टी संशोधन पहा**. प्रकाशित समुदाय, क्षेत्रीय सर्वेक्षणे, जैवविविधता नोंदी, आव्हाने आणि पुरावे पाहता येतात. | Archive routes and visit-request rules; visits are research access, not open tourism. | Two CTAs with clear verbs; keep visible long enough for rapid scrolling. |

## Typography and emphasis decisions

- **AMS Samanya Regular** is the Marathi UI/body face: navigation, paragraphs, metadata, forms, labels, and archive tables.
- **AMS Kashi Regular** is reserved for Marathi display headings and short reflective titles. It is not used for dense evidence tables or controls.
- Niagara Solid is not used: it is a decorative Latin display face and is not appropriate for Marathi body copy or accessibility-critical UI.
- Only regular font files are available. Do not synthesize a thin or heavy Marathi style; use size, colour, spacing, and a restrained bold fallback where needed.
- Marathi paragraphs use comfortable line-height and constrained measure. Italics are not used for Marathi body copy because a matching italic face is not available.
- Bold is limited to headings, evidence labels, key place names, and actions.

## Unresolved content questions

- Partnership and funding roles remain researcher-provided in the Evidence Register and are labelled accordingly.
- The project-wide number of confirmed research districts remains unresolved.
- The project does not currently publish a public contribution form; the site offers research-access requests only.
- Exact licenses for the supplied AMS font files were not included in the repository. The files are used as project-provided assets with system fallbacks; formal web-embedding approval should be recorded by the project owner before public redistribution.
