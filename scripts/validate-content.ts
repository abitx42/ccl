import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import {
  districtSchema,
  villageSchema,
  personSchema,
  surveySchema,
  speciesSchema,
  challengeSchema,
  mediaSchema,
  evidenceSchema
} from '../src/schemas/index.js';

const CONTENT_DIR = path.resolve(process.cwd(), 'content');

export interface ValidationReport {
  errors: string[];
  warnings: string[];
  counts: {
    technicalDistricts: number;
    places: number;
    surveys: number;
    species: number;
    challenges: number;
    people: number;
    media: number;
    evidenceClaims: number;
  };
}

export function validateContent(contentDir: string = CONTENT_DIR): {
  report: ValidationReport;
  placesMap: Map<string, any>;
  peopleMap: Map<string, any>;
  evidenceMap: Map<string, any>;
} {
  const report: ValidationReport = {
    errors: [],
    warnings: [],
    counts: {
      technicalDistricts: 0,
      places: 0,
      surveys: 0,
      species: 0,
      challenges: 0,
      people: 0,
      media: 0,
      evidenceClaims: 0
    }
  };

  function readYamlFile<T>(filePath: string): T | null {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return yaml.load(raw) as T;
    } catch (err: any) {
      report.errors.push(`[YAML Parse Error] ${filePath}: ${err.message}`);
      return null;
    }
  }

  function dataIsValid(d: any): boolean {
    return Boolean(d && typeof d === 'object');
  }

  // 1. Validate Evidence Claims
  const evidenceMap = new Map<string, any>();
  const evidenceDir = path.join(contentDir, 'evidence');
  if (fs.existsSync(evidenceDir)) {
    const files = fs.readdirSync(evidenceDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
    for (const file of files) {
      const p = path.join(evidenceDir, file);
      const data = readYamlFile<any>(p);
      if (!data) continue;
      const result = evidenceSchema.safeParse(data);
      if (!result.success) {
        report.errors.push(`[Evidence Schema Error] ${p}: ${JSON.stringify(result.error.issues)}`);
      } else {
        evidenceMap.set(data.id, data);
        // Hard Rule: Evidence is independent from consent.
        // Only verified or researcher_verified evidence claims enter verified statistics
        if (data.state === 'verified' || data.state === 'researcher_verified') {
          report.counts.evidenceClaims++;
        }
      }
    }
  }

  // 2. Validate Centralized People Records (content/people/)
  const peopleMap = new Map<string, any>();
  const peopleDir = path.join(contentDir, 'people');
  if (fs.existsSync(peopleDir)) {
    const pFiles = fs.readdirSync(peopleDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
    for (const file of pFiles) {
      const pPath = path.join(peopleDir, file);
      const pData = readYamlFile<any>(pPath);
      if (!dataIsValid(pData)) continue;
      const res = personSchema.safeParse(pData);
      if (!res.success) {
        report.errors.push(`[Person Schema Error] ${pPath}: ${JSON.stringify(res.error.issues)}`);
      } else {
        // HARD RULE: Consent Gating
        const consentState = pData.consent?.state || pData.consent?.status;
        if (pData.status === 'published' && consentState !== 'granted') {
          report.errors.push(`[Consent Violation] Person ${pData.id} in ${pPath} is marked published, but consent is ${consentState} (must be 'granted')`);
        }

        // Scope check for public profile
        if (pData.status === 'published' && (!pData.consent?.scope || !pData.consent.scope.includes('name'))) {
          report.errors.push(`[Consent Scope Missing] Person ${pData.id} in ${pPath} is published, but 'name' is not in consent.scope`);
        }

        // Check photo consent: if photo is specified, consent.scope must include 'photo'
        if (pData.photo && pData.photo.trim() !== '' && (!pData.consent?.scope || !pData.consent.scope.includes('photo'))) {
          report.errors.push(`[Photo Consent Violation] Person ${pData.id} in ${pPath} has a photo specified, but 'photo' is not in consent.scope: ${JSON.stringify(pData.consent?.scope)}`);
        }

        peopleMap.set(pData.id, pData);
        if (pData.status === 'published' && pData.visibility === 'public' && consentState === 'granted') {
          report.counts.people++;
        }
      }
    }
  }

  // 3. Helper: Validate Contextual Quotes
  function validateContextualQuote(q: any, parentRecordId: string, parentPath: string) {
    if (!q) return;

    // Contributor exists
    let contributorPerson: any = null;
    if (q.contributor) {
      if (!peopleMap.has(q.contributor)) {
        report.errors.push(`[Missing Quote Contributor] Record ${parentRecordId} in ${parentPath} references non-existent contributor ID: ${q.contributor}`);
      } else {
        contributorPerson = peopleMap.get(q.contributor);
      }
    }

    // Attribution consistency check (Hard Rule: attribution must align with contributor person record)
    if (q.contributor && contributorPerson && q.attribution) {
      const attrString = typeof q.attribution === 'string' ? q.attribution : (q.attribution.en || q.attribution.mr || q.attribution.hi || '');
      const pNameEn = typeof contributorPerson.name === 'string' ? contributorPerson.name : contributorPerson.name.en;
      const pNameMr = typeof contributorPerson.name === 'object' ? contributorPerson.name.mr : '';
      const pNameHi = typeof contributorPerson.name === 'object' ? contributorPerson.name.hi : '';

      const normalize = (s: string) => s.toLowerCase().replace(/^(dr\.|shri|smt\.|prof\.)\s+/i, '').trim();
      const normAttr = normalize(attrString);
      const normEn = normalize(pNameEn || '');
      const normMr = normalize(pNameMr || '');
      const normHi = normalize(pNameHi || '');

      const isMatch = normAttr.includes(normEn) || normEn.includes(normAttr) ||
                      (normMr && (normAttr.includes(normMr) || normMr.includes(normAttr))) ||
                      (normHi && (normAttr.includes(normHi) || normHi.includes(normAttr)));

      if (!isMatch) {
        report.errors.push(`[Quote Attribution Mismatch] Record ${parentRecordId} references contributor ${q.contributor} ("${pNameEn}"), but attribution is "${attrString}". Attribution must align with the contributor person record.`);
      }
    }

    // Consent check (independent from evidence)
    if (q.consent) {
      const consentState = q.consent.state || q.consent.status;
      if (consentState !== 'granted') {
        report.errors.push(`[Quote Consent Violation] Quote in ${parentRecordId} (${parentPath}) has consent state '${consentState}', must be 'granted'`);
      }
      if (q.consent.scope && Array.isArray(q.consent.scope) && !q.consent.scope.includes('quote')) {
        report.errors.push(`[Quote Scope Missing] Quote in ${parentRecordId} (${parentPath}) consent.scope missing 'quote': ${JSON.stringify(q.consent.scope)}`);
      }
    }
  }

  // 4. Validate Districts & Places / Communities (PLC-*)
  const placesMap = new Map<string, any>();
  const districtsDir = path.join(contentDir, 'districts');
  if (fs.existsSync(districtsDir)) {
    const districts = fs.readdirSync(districtsDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    for (const districtSlug of districts) {
      const distYaml = path.join(districtsDir, districtSlug, 'district.yaml');
      if (!fs.existsSync(distYaml)) {
        report.errors.push(`[Missing District Config] Expected ${distYaml}`);
        continue;
      }
      const distData = readYamlFile<any>(distYaml);
      if (!distData) continue;
      const distParsed = districtSchema.safeParse(distData);
      if (!distParsed.success) {
        report.errors.push(`[District Schema Error] ${distYaml}: ${JSON.stringify(distParsed.error.issues)}`);
      } else {
        report.counts.technicalDistricts++;
      }

      // Villages / Places
      const villagesDir = path.join(districtsDir, districtSlug, 'villages');
      if (fs.existsSync(villagesDir)) {
        const villageFolders = fs.readdirSync(villagesDir, { withFileTypes: true })
          .filter(v => v.isDirectory())
          .map(v => v.name);

        for (const vSlug of villageFolders) {
          const vDir = path.join(villagesDir, vSlug);
          const vYaml = path.join(vDir, 'village.yaml');
          if (fs.existsSync(vYaml)) {
            const vData = readYamlFile<any>(vYaml);
            if (vData) {
              const vParsed = villageSchema.safeParse(vData);
              if (!vParsed.success) {
                report.errors.push(`[Place Schema Error] ${vYaml}: ${JSON.stringify(vParsed.error.issues)}`);
              } else {
                report.counts.places++;
                placesMap.set(vData.id, vData);

                // Check visibility leaks
                if (vData.status === 'published' && vData.visibility !== 'public') {
                  report.errors.push(`[Visibility Leak] Place ${vData.id} is marked published but visibility is '${vData.visibility}' (must be 'public')`);
                }

                // Verify referenced people
                if (vData.people && Array.isArray(vData.people)) {
                  for (const pid of vData.people) {
                    if (!peopleMap.has(pid)) {
                      report.errors.push(`[Missing Person Reference] Place ${vData.id} references non-existent person ID: ${pid}`);
                    } else {
                      const referencedPerson = peopleMap.get(pid);
                      const refConsent = referencedPerson.consent?.state || referencedPerson.consent?.status;
                      if (vData.status === 'published' && (referencedPerson.status !== 'published' || refConsent !== 'granted')) {
                        report.errors.push(`[Consent/Visibility Leak] Published place ${vData.id} references person ${pid} who is either not published or lacks granted consent`);
                      }
                    }
                  }
                }

                // Verify contextual quotes on place
                if (vData.quotes && Array.isArray(vData.quotes)) {
                  for (const q of vData.quotes) {
                    validateContextualQuote(q, vData.id, vYaml);
                  }
                }
              }
            }
          }

          // Survey validation
          const surveysDir = path.join(vDir, 'surveys');
          if (fs.existsSync(surveysDir)) {
            for (const f of fs.readdirSync(surveysDir).filter(f => f.endsWith('.yaml'))) {
              const sPath = path.join(surveysDir, f);
              const sData = readYamlFile<any>(sPath);
              if (sData) {
                const res = surveySchema.safeParse(sData);
                if (!res.success) {
                  report.errors.push(`[Survey Schema Error] ${sPath}: ${JSON.stringify(res.error.issues)}`);
                } else {
                  report.counts.surveys++;
                  if (sData.places && Array.isArray(sData.places)) {
                    for (const placeId of sData.places) {
                      if (!placesMap.has(placeId)) {
                        report.errors.push(`[Missing Place Reference] Survey ${sData.id} in ${sPath} references non-existent place ID: ${placeId}`);
                      }
                    }
                  }
                }
              }
            }
          }

          // Species validation
          const speciesDir = path.join(vDir, 'species');
          if (fs.existsSync(speciesDir)) {
            for (const f of fs.readdirSync(speciesDir).filter(f => f.endsWith('.yaml'))) {
              const spPath = path.join(speciesDir, f);
              const spData = readYamlFile<any>(spPath);
              if (spData) {
                const res = speciesSchema.safeParse(spData);
                if (!res.success) {
                  report.errors.push(`[Species Schema Error] ${spPath}: ${JSON.stringify(res.error.issues)}`);
                } else {
                  report.counts.species++;
                  if (spData.places && Array.isArray(spData.places)) {
                    for (const placeId of spData.places) {
                      if (!placesMap.has(placeId)) {
                        report.errors.push(`[Missing Place Reference] Species ${spData.id} in ${spPath} references non-existent place ID: ${placeId}`);
                      }
                    }
                  }
                }
              }
            }
          }

          // Challenges validation
          const chDir = path.join(vDir, 'challenges');
          if (fs.existsSync(chDir)) {
            for (const f of fs.readdirSync(chDir).filter(f => f.endsWith('.yaml'))) {
              const chPath = path.join(chDir, f);
              const chData = readYamlFile<any>(chPath);
              if (chData) {
                const res = challengeSchema.safeParse(chData);
                if (!res.success) {
                  report.errors.push(`[Challenge Schema Error] ${chPath}: ${JSON.stringify(res.error.issues)}`);
                } else {
                  report.counts.challenges++;
                  if (chData.places && Array.isArray(chData.places)) {
                    for (const placeId of chData.places) {
                      if (!placesMap.has(placeId)) {
                        report.errors.push(`[Missing Place Reference] Challenge ${chData.id} in ${chPath} references non-existent place ID: ${placeId}`);
                      }
                    }
                  }
                  if (chData.quotes && Array.isArray(chData.quotes)) {
                    for (const q of chData.quotes) {
                      validateContextualQuote(q, chData.id, chPath);
                    }
                  }
                  if (chData.interventions && Array.isArray(chData.interventions)) {
                    for (const it of chData.interventions) {
                      if (it.quote) {
                        validateContextualQuote(it.quote, `${chData.id}#${it.id}`, chPath);
                      }
                    }
                  }
                }
              }
            }
          }

          // Media validation
          const mediaDir = path.join(vDir, 'media');
          if (fs.existsSync(mediaDir)) {
            for (const f of fs.readdirSync(mediaDir).filter(f => f.endsWith('.yaml'))) {
              const mPath = path.join(mediaDir, f);
              const mData = readYamlFile<any>(mPath);
              if (mData) {
                const res = mediaSchema.safeParse(mData);
                if (!res.success) {
                  report.errors.push(`[Media Schema Error] ${mPath}: ${JSON.stringify(res.error.issues)}`);
                } else {
                  if (mData.status === 'published' && mData.shows_people && mData.consent?.state !== 'granted') {
                    report.errors.push(`[Consent Violation] Media ${mData.id} in ${mPath} shows people, but consent is ${mData.consent?.state}`);
                  }
                  report.counts.media++;
                }
              }
            }
          }
        }
      }
    }

    // Verify all place references in Person records
    for (const [pId, pData] of peopleMap) {
      if (pData.places && Array.isArray(pData.places)) {
        for (const placeId of pData.places) {
          if (!placesMap.has(placeId)) {
            report.errors.push(`[Missing Place Reference] Person ${pId} references non-existent place ID: ${placeId}`);
          }
        }
      }
    }
  }

  return { report, placesMap, peopleMap, evidenceMap };
}

// CLI Execution
const isMainScript = process.argv[1] && process.argv[1].endsWith('validate-content.ts');
if (isMainScript) {
  const { report } = validateContent(CONTENT_DIR);

  // Write computed statistics to content/site/stats.json (never typed manually)
  const siteDir = path.join(CONTENT_DIR, 'site');
  if (!fs.existsSync(siteDir)) {
    fs.mkdirSync(siteDir, { recursive: true });
  }

  const computedStats = {
    technical_districts_loaded: report.counts.technicalDistricts,
    confirmed_project_districts: 'unresolved',
    places_profiled: report.counts.places,
    surveys_completed: report.counts.surveys,
    species_recorded: report.counts.species,
    challenges_documented: report.counts.challenges,
    people_acknowledged: report.counts.people,
    media_verified: report.counts.media,
    evidence_claims: report.counts.evidenceClaims,
    last_computed_at: new Date().toISOString()
  };

  fs.writeFileSync(path.join(siteDir, 'stats.json'), JSON.stringify(computedStats, null, 2));

  console.log('--- CCL Content & Schema Validation Report ---');
  console.log(`Technical implementation districts: ${report.counts.technicalDistricts}`);
  console.log(`    → Palghar (technical/reference implementation)`);
  console.log(`Confirmed project research districts:`);
  console.log(`    → currently unresolved / do not publish a total`);
  console.log(`Places / Communities Profiled:     ${report.counts.places}`);
  console.log(`Aggregated Surveys:                ${report.counts.surveys}`);
  console.log(`Species Observations:              ${report.counts.species}`);
  console.log(`Challenges Documented:             ${report.counts.challenges}`);
  console.log(`People (Consent-Gated):            ${report.counts.people}`);
  console.log(`Media Records:                     ${report.counts.media}`);
  console.log(`Verified Evidence Claims:          ${report.counts.evidenceClaims}`);
  console.log(`Computed stats written to: ${path.join(siteDir, 'stats.json')}`);

  if (report.errors.length > 0) {
    console.error('\nValidation FAILED with errors:');
    for (const err of report.errors) {
      console.error(`  ❌ ${err}`);
    }
    process.exit(1);
  } else {
    console.log('\nValidation Status:');
    console.log('  Schema/content validation: PASS');
    console.log('  Consent/publication gates: PASS');
    console.log('  Evidence verification: according to individual record status');
    console.log('  Project-scope confirmation: unresolved where applicable');
    process.exit(0);
  }
}
