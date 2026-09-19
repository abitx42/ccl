import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import type {
  districtSchema,
  villageSchema,
  personSchema,
  surveySchema,
  speciesSchema,
  challengeSchema,
  evidenceSchema
} from '../schemas/index.js';
import type { z } from 'astro/zod';

export type District = z.infer<typeof districtSchema>;
export type Village = z.infer<typeof villageSchema>;
export type Person = z.infer<typeof personSchema>;
export type Survey = z.infer<typeof surveySchema>;
export type Species = z.infer<typeof speciesSchema>;
export type Challenge = z.infer<typeof challengeSchema>;
export type Evidence = z.infer<typeof evidenceSchema>;

const CONTENT_DIR = path.resolve(process.cwd(), 'content');

function readYaml<T>(filePath: string): T | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    return yaml.load(fs.readFileSync(filePath, 'utf-8')) as T;
  } catch {
    return null;
  }
}

// 1. Get all published districts (Data-driven, NEVER hard-coded)
export function getDistricts(): District[] {
  const distDir = path.join(CONTENT_DIR, 'districts');
  if (!fs.existsSync(distDir)) return [];
  const entries = fs.readdirSync(distDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const districts: District[] = [];
  for (const slug of entries) {
    const data = readYaml<District>(path.join(distDir, slug, 'district.yaml'));
    if (data) districts.push(data);
  }
  return districts;
}

export function getDistrict(slug: string): District | null {
  return readYaml<District>(path.join(CONTENT_DIR, 'districts', slug, 'district.yaml'));
}

// 2. Get villages for a district (Only public & published)
export function getVillages(districtSlug: string): Village[] {
  const vDir = path.join(CONTENT_DIR, 'districts', districtSlug, 'villages');
  if (!fs.existsSync(vDir)) return [];
  const entries = fs.readdirSync(vDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const villages: Village[] = [];
  for (const slug of entries) {
    const data = readYaml<Village>(path.join(vDir, slug, 'village.yaml'));
    if (data && data.status === 'published' && data.visibility === 'public') {
      villages.push(data);
    }
  }
  return villages;
}

export function getVillage(districtSlug: string, villageSlug: string): Village | null {
  const data = readYaml<Village>(path.join(CONTENT_DIR, 'districts', districtSlug, 'villages', villageSlug, 'village.yaml'));
  if (data && data.status === 'published' && data.visibility === 'public') {
    return data;
  }
  return null;
}

// 3. Surveys (Public & published only)
export function getSurveys(placeId: string, districtSlug: string, villageSlug: string): Survey[] {
  const sDir = path.join(CONTENT_DIR, 'districts', districtSlug, 'villages', villageSlug, 'surveys');
  if (!fs.existsSync(sDir)) return [];
  const files = fs.readdirSync(sDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
  const surveys: Survey[] = [];
  for (const f of files) {
    const data = readYaml<Survey>(path.join(sDir, f));
    if (data && data.status === 'published' && data.visibility === 'public' && data.places.includes(placeId)) {
      surveys.push(data);
    }
  }
  return surveys;
}

// 4. Species (Public & published only)
export function getSpecies(placeId: string, districtSlug: string, villageSlug: string): Species[] {
  const spDir = path.join(CONTENT_DIR, 'districts', districtSlug, 'villages', villageSlug, 'species');
  if (!fs.existsSync(spDir)) return [];
  const files = fs.readdirSync(spDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
  const speciesList: Species[] = [];
  for (const f of files) {
    const data = readYaml<Species>(path.join(spDir, f));
    if (data && data.status === 'published' && data.visibility === 'public' && data.places.includes(placeId)) {
      speciesList.push(data);
    }
  }
  return speciesList;
}

// 5. Challenges (Public & published only)
export function getChallenges(placeId: string, districtSlug: string, villageSlug: string): Challenge[] {
  const chDir = path.join(CONTENT_DIR, 'districts', districtSlug, 'villages', villageSlug, 'challenges');
  if (!fs.existsSync(chDir)) return [];
  const files = fs.readdirSync(chDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
  const challenges: Challenge[] = [];
  for (const f of files) {
    const data = readYaml<Challenge>(path.join(chDir, f));
    if (data && data.status === 'published' && data.visibility === 'public' && data.places.includes(placeId)) {
      challenges.push(data);
    }
  }
  return challenges;
}

// 6. People (Centralized, scalable, consent-gated: only if consent is granted)
function isPersonConsentedAndPublic(data: Person | null): boolean {
  if (!data) return false;
  const isPublic = data.status === 'published' && data.visibility === 'public';
  const consentState = data.consent?.state || (data.consent as any)?.status;
  return isPublic && consentState === 'granted';
}

export function getPeople(peopleIds?: string[]): Person[] {
  if (!peopleIds || peopleIds.length === 0) return [];
  const pDir = path.join(CONTENT_DIR, 'people');
  if (!fs.existsSync(pDir)) return [];
  const people: Person[] = [];
  for (const id of peopleIds) {
    const filePath = path.join(pDir, `${id}.yaml`);
    const data = readYaml<Person>(filePath);
    if (isPersonConsentedAndPublic(data)) {
      people.push(data!);
    }
  }
  return people;
}

export function getPerson(id: string): Person | null {
  const filePath = path.join(CONTENT_DIR, 'people', `${id}.yaml`);
  const data = readYaml<Person>(filePath);
  return isPersonConsentedAndPublic(data) ? data : null;
}

export function getAllPeople(): Person[] {
  const pDir = path.join(CONTENT_DIR, 'people');
  if (!fs.existsSync(pDir)) return [];
  const files = fs.readdirSync(pDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
  const people: Person[] = [];
  for (const file of files) {
    const data = readYaml<Person>(path.join(pDir, file));
    if (isPersonConsentedAndPublic(data)) {
      people.push(data!);
    }
  }
  return people;
}

// 7. Site computed stats
export function getComputedStats() {
  const statsPath = path.join(CONTENT_DIR, 'site', 'stats.json');
  if (!fs.existsSync(statsPath)) {
    return {
      districts_active: 0,
      villages_profiled: 0,
      surveys_completed: 0,
      species_recorded: 0,
      challenges_documented: 0,
      people_acknowledged: 0,
      media_verified: 0,
      evidence_claims: 0
    };
  }
  return JSON.parse(fs.readFileSync(statsPath, 'utf-8'));
}

// 8. Evidence claims
export function getEvidence(id: string): Evidence | null {
  const filePath = path.join(CONTENT_DIR, 'evidence', `${id}.yaml`);
  return readYaml<Evidence>(filePath);
}
