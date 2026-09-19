import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { validateContent } from './validate-content.js';
import { isPersonConsentedAndPublic } from '../src/lib/content.js';

const TEST_DIR = path.resolve(process.cwd(), 'tmp-adversarial-test');

function setupBaseFixtures() {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }

  // 1. Evidence directory
  const evDir = path.join(TEST_DIR, 'evidence');
  fs.mkdirSync(evDir, { recursive: true });
  fs.writeFileSync(path.join(evDir, 'EV-0001.yaml'), yaml.dump({
    id: 'EV-0001',
    claim: { en: 'Baseline verified claim' },
    type: 'official_document',
    source: 'University Records',
    state: 'verified',
    verified_by: 'Lead Researcher',
    verified_on: '2026-08-01',
    conflicts_with: []
  }));

  // 2. People directory
  const pDir = path.join(TEST_DIR, 'people');
  fs.mkdirSync(pDir, { recursive: true });
  fs.writeFileSync(path.join(pDir, 'PPL-0001.yaml'), yaml.dump({
    id: 'PPL-0001',
    status: 'published',
    visibility: 'public',
    verification: {
      level: 'verified',
      verified_by: 'Field Director',
      verified_on: '2026-08-01'
    },
    evidence: ['EV-0001'],
    role: { en: 'Certified Master Trainer' },
    name: { en: 'Dr. Nilesh Jawalkar' },
    places: ['PLC-0002'],
    photo: '',
    photo_credit: '',
    consent: {
      state: 'granted',
      scope: ['name', 'quote', 'story'],
      form_id: 'CF-001',
      obtained_on: '2026-07-20',
      guardian_consent: false
    }
  }));

  // 3. Districts & Villages directory
  const vDir = path.join(TEST_DIR, 'districts', 'palghar', 'villages', 'manor');
  fs.mkdirSync(vDir, { recursive: true });

  fs.writeFileSync(path.join(TEST_DIR, 'districts', 'palghar', 'district.yaml'), yaml.dump({
    slug: 'palghar',
    name: { en: 'Palghar' },
    theme: 'palghar',
    tagline: { en: 'Technical reference implementation' },
    coordinates: { lat: 19.69, lng: 72.76 },
    hero: { image: './hero.jpg', alt: { en: 'Hero' }, credit: 'UoM' },
    research_period: { start: '2025-06' }
  }));

  fs.writeFileSync(path.join(vDir, 'village.yaml'), yaml.dump({
    id: 'PLC-0002',
    slug: 'manor',
    district: 'palghar',
    status: 'published',
    visibility: 'public',
    verification: {
      level: 'verified',
      verified_by: 'Field Director',
      verified_on: '2026-08-01'
    },
    evidence: ['EV-0001'],
    name: { en: 'Manor' },
    community_type: 'tribal',
    geography: { administrative_district: 'Palghar' },
    project: { research_district: 'palghar', classification_confirmed: true },
    about: { documented_source: { en: 'Documented account of Manor' } },
    people: ['PPL-0001'],
    quotes: []
  }));
}

function cleanup() {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }
}

interface TestResult {
  name: string;
  passed: boolean;
  reason: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, detail: string) {
  if (condition) {
    results.push({ name, passed: true, reason: detail });
    console.log(`  PASS: ${name} — ${detail}`);
  } else {
    results.push({ name, passed: false, reason: detail });
    console.error(`  FAIL: ${name} — ${detail}`);
  }
}

console.log('================================================================');
console.log('RUNNING ADVERSARIAL VALIDATION TEST SUITE');
console.log('================================================================\n');

try {
  // Test 1: Valid Baseline
  setupBaseFixtures();
  const baseRes = validateContent(TEST_DIR);
  assert(baseRes.report.errors.length === 0, '1. Valid Baseline', 'Valid fixtures pass with 0 errors');

  // Test 2: Nonexistent Person Reference
  setupBaseFixtures();
  const vYamlPath = path.join(TEST_DIR, 'districts', 'palghar', 'villages', 'manor', 'village.yaml');
  const vData = yaml.load(fs.readFileSync(vYamlPath, 'utf-8')) as any;
  vData.people.push('PPL-9999');
  fs.writeFileSync(vYamlPath, yaml.dump(vData));
  const t2Res = validateContent(TEST_DIR);
  const t2Matched = t2Res.report.errors.some(e => e.includes('Missing Person Reference') && e.includes('PPL-9999'));
  assert(t2Matched, '2. Nonexistent Person Reference', 'Caught missing person ID PPL-9999 in village.people');

  // Test 3: Nonexistent Place Reference
  setupBaseFixtures();
  const pYamlPath = path.join(TEST_DIR, 'people', 'PPL-0001.yaml');
  const pData = yaml.load(fs.readFileSync(pYamlPath, 'utf-8')) as any;
  pData.places.push('PLC-9999');
  fs.writeFileSync(pYamlPath, yaml.dump(pData));
  const t3Res = validateContent(TEST_DIR);
  const t3Matched = t3Res.report.errors.some(e => e.includes('Missing Place Reference') && e.includes('PLC-9999'));
  assert(t3Matched, '3. Nonexistent Place Reference', 'Caught missing place ID PLC-9999 in person.places');

  // Test 4: Photo without Photo Consent
  setupBaseFixtures();
  const pData4 = yaml.load(fs.readFileSync(pYamlPath, 'utf-8')) as any;
  pData4.photo = 'portrait.jpg';
  pData4.consent.scope = ['name', 'story']; // NO photo scope
  fs.writeFileSync(pYamlPath, yaml.dump(pData4));
  const t4Res = validateContent(TEST_DIR);
  const t4Matched = t4Res.report.errors.some(e => e.includes('Photo Consent Violation') && e.includes('PPL-0001'));
  assert(t4Matched, '4. Photo without Photo Consent', 'Caught photo specified when consent.scope lacks "photo"');

  // Test 5: Quote without Quote Consent
  setupBaseFixtures();
  const vData5 = yaml.load(fs.readFileSync(vYamlPath, 'utf-8')) as any;
  vData5.quotes.push({
    text: 'Water levels rising rapidly.',
    contributor: 'PPL-0001',
    attribution: 'Dr. Nilesh Jawalkar',
    consent: { state: 'pending', scope: ['quote'] } // Pending consent
  });
  fs.writeFileSync(vYamlPath, yaml.dump(vData5));
  const t5Res = validateContent(TEST_DIR);
  const t5Matched = t5Res.report.errors.some(e => e.includes('Quote Consent Violation') && e.includes('pending'));
  assert(t5Matched, '5. Quote without Granted Consent', 'Blocked quote with pending consent state');

  // Test 6: Quote with Wrong Contributor Attribution Mismatch
  setupBaseFixtures();
  const vData6 = yaml.load(fs.readFileSync(vYamlPath, 'utf-8')) as any;
  vData6.quotes.push({
    text: 'Water levels rising rapidly.',
    contributor: 'PPL-0001', // PPL-0001 is Dr. Nilesh Jawalkar
    attribution: 'Dr. John Doe Unrelated', // Completely unrelated attribution
    consent: { state: 'granted', scope: ['quote'] }
  });
  fs.writeFileSync(vYamlPath, yaml.dump(vData6));
  const t6Res = validateContent(TEST_DIR);
  const t6Matched = t6Res.report.errors.some(e => e.includes('Quote Attribution Mismatch') && e.includes('PPL-0001'));
  assert(t6Matched, '6. Quote Attribution Mismatch', 'Caught attribution mismatch ("Dr. John Doe Unrelated" vs Dr. Nilesh Jawalkar)');

  // Test 7: Withdrawn Person
  setupBaseFixtures();
  const pData7 = yaml.load(fs.readFileSync(pYamlPath, 'utf-8')) as any;
  pData7.consent.state = 'withdrawn';
  fs.writeFileSync(pYamlPath, yaml.dump(pData7));
  const t7Res = validateContent(TEST_DIR);
  const t7Matched = t7Res.report.errors.some(e => e.includes('Consent Violation') && e.includes('withdrawn'));
  const t7Filtered = !isPersonConsentedAndPublic(pData7);
  assert(t7Matched && t7Filtered, '7. Withdrawn Person', 'Build error raised and isPersonConsentedAndPublic returns false');

  // Test 8: Unpublished Quote Scope Missing
  setupBaseFixtures();
  const vData8 = yaml.load(fs.readFileSync(vYamlPath, 'utf-8')) as any;
  vData8.quotes.push({
    text: 'Warli art is intertwined with the forest.',
    contributor: 'PPL-0001',
    attribution: 'Dr. Nilesh Jawalkar',
    consent: { state: 'granted', scope: ['name', 'story'] } // Scope missing 'quote'
  });
  fs.writeFileSync(vYamlPath, yaml.dump(vData8));
  const t8Res = validateContent(TEST_DIR);
  const t8Matched = t8Res.report.errors.some(e => e.includes('Quote Scope Missing'));
  assert(t8Matched, '8. Quote Missing Quote Scope', 'Blocked quote when consent.scope lacks "quote"');

  // Test 9: Unverified Evidence Used in Statistics
  setupBaseFixtures();
  const evDir = path.join(TEST_DIR, 'evidence');
  fs.writeFileSync(path.join(evDir, 'EV-9999.yaml'), yaml.dump({
    id: 'EV-9999',
    claim: { en: 'Unverified draft claim' },
    type: 'secondary_source',
    source: 'Unverified report',
    state: 'pending_verification', // NOT verified
    conflicts_with: []
  }));
  const t9Res = validateContent(TEST_DIR);
  // Verified count should strictly remain 1 (only EV-0001), ignoring EV-9999
  const t9OnlyVerifiedCounted = t9Res.report.counts.evidenceClaims === 1;
  assert(t9OnlyVerifiedCounted, '9. Unverified Evidence Filtered from Stats', 'Pending evidence EV-9999 excluded from verified claims count (1 verified)');

  // Test 10: Visibility Leak on Restricted Place
  setupBaseFixtures();
  const vData10 = yaml.load(fs.readFileSync(vYamlPath, 'utf-8')) as any;
  vData10.status = 'published';
  vData10.visibility = 'restricted'; // Leaking restricted data into published status
  fs.writeFileSync(vYamlPath, yaml.dump(vData10));
  const t10Res = validateContent(TEST_DIR);
  const t10Matched = t10Res.report.errors.some(e => e.includes('Visibility Leak') && e.includes('restricted'));
  assert(t10Matched, '10. Restricted Record Visibility Leak', 'Caught published place with restricted visibility');

} finally {
  cleanup();
  console.log('\nTemporary fixtures cleaned up.');
}

console.log('\n================================================================');
const allPassed = results.every(r => r.passed);
if (allPassed) {
  console.log(`ALL ${results.length} ADVERSARIAL VALIDATION TESTS PASSED!`);
  console.log('================================================================');
  process.exit(0);
} else {
  console.error('SOME ADVERSARIAL VALIDATION TESTS FAILED');
  console.log('================================================================');
  process.exit(1);
}
