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

interface ValidationReport {
  errors: string[];
  warnings: string[];
  counts: {
    districts: number;
    villages: number;
    surveys: number;
    species: number;
    challenges: number;
    people: number;
    media: number;
    evidenceClaims: number;
  };
}

const report: ValidationReport = {
  errors: [],
  warnings: [],
  counts: {
    districts: 0,
    villages: 0,
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

// 1. Validate Evidence Claims
const evidenceMap = new Map<string, any>();
const evidenceDir = path.join(CONTENT_DIR, 'evidence');
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
      report.counts.evidenceClaims++;
    }
  }
}

// 1b. Validate Centralized People Records (content/people/)
const peopleMap = new Map<string, any>();
const peopleDir = path.join(CONTENT_DIR, 'people');
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
      if (pData.status === 'published' && pData.consent?.state !== 'granted') {
        report.errors.push(`[Consent Violation] Person ${pData.id} in ${pPath} is marked published, but consent is ${pData.consent?.state} (must be 'granted')`);
      }
      peopleMap.set(pData.id, pData);
      if (pData.status === 'published' && pData.visibility === 'public' && pData.consent?.state === 'granted') {
        report.counts.people++;
      }
    }
  }
}

function dataIsValid(d: any) {
  return d && typeof d === 'object';
}

// 2. Validate Districts & Villages
const districtsDir = path.join(CONTENT_DIR, 'districts');
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
      report.counts.districts++;
    }

    // Villages
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
              report.errors.push(`[Village Schema Error] ${vYaml}: ${JSON.stringify(vParsed.error.issues)}`);
            } else {
              report.counts.villages++;

              // Check consent gating for published records
              if (vData.status === 'published' && vData.visibility !== 'public') {
                report.errors.push(`[Visibility Leak] Village ${vData.id} is marked published but visibility is not public`);
              }

              // Verify referenced people
              if (vData.people && Array.isArray(vData.people)) {
                for (const pid of vData.people) {
                  if (!peopleMap.has(pid)) {
                    report.errors.push(`[Missing Person Reference] Village ${vData.id} references non-existent person ID: ${pid}`);
                  }
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
                // HARD RULE: If shows_people, consent must be granted
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
}

// Write computed statistics to content/site/stats.json (never typed manually)
const siteDir = path.join(CONTENT_DIR, 'site');
if (!fs.existsSync(siteDir)) {
  fs.mkdirSync(siteDir, { recursive: true });
}

const computedStats = {
  districts_active: report.counts.districts,
  villages_profiled: report.counts.villages,
  surveys_completed: report.counts.surveys,
  species_recorded: report.counts.species,
  challenges_documented: report.counts.challenges,
  people_acknowledged: report.counts.people,
  media_verified: report.counts.media,
  evidence_claims: report.counts.evidenceClaims,
  last_computed_at: new Date().toISOString()
};

fs.writeFileSync(path.join(siteDir, 'stats.json'), JSON.stringify(computedStats, null, 2));

console.log('--- CCL Content Validation Report ---');
console.log(`Active Districts (Loaded): ${report.counts.districts}`);
console.log(`Villages / Places:         ${report.counts.villages}`);
console.log(`Aggregated Surveys:        ${report.counts.surveys}`);
console.log(`Species Observations:      ${report.counts.species}`);
console.log(`Challenges Documented:     ${report.counts.challenges}`);
console.log(`People (Consent-Gated):    ${report.counts.people}`);
console.log(`Media Records:             ${report.counts.media}`);
console.log(`Evidence Claims:           ${report.counts.evidenceClaims}`);
console.log(`Computed stats written to: ${path.join(siteDir, 'stats.json')}`);

if (report.errors.length > 0) {
  console.error('\nValidation FAILED with errors:');
  for (const err of report.errors) {
    console.error(`  ❌ ${err}`);
  }
  process.exit(1);
} else {
  console.log('\n✅ All content records verified and consent gates passed.');
  process.exit(0);
}
