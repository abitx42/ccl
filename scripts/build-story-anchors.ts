import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { storyAnchorsFileSchema } from '../src/schemas/index.js';

const CONTENT_DIR = path.resolve(process.cwd(), 'content');
const OUTPUT_FILE = path.resolve(process.cwd(), 'public/geo/story-anchors.json');

// 1. Verified Institutional Partner Anchors
// Note: Coordinates flagged as TODO(content) per Evidence Register until confirmed
const baseAnchors = [
  {
    id: 'ANC-BRISTOL',
    type: 'partner' as const,
    name: {
      en: 'University of Bristol',
      mr: 'ब्रिस्टल विद्यापीठ',
      hi: 'ब्रिस्टल विश्वविद्यालय'
    },
    lat: 51.4584,
    lng: -2.6030,
    order: 1,
    note: 'TODO(content): Institutional coordinates to be formally verified by project liaison'
  },
  {
    id: 'ANC-MUMBAI',
    type: 'partner' as const,
    name: {
      en: 'University of Mumbai (CCCSS, Kalina)',
      mr: 'मुंबई विद्यापीठ (कलिना परिसर)',
      hi: 'मुंबई विश्वविद्यालय (कलीना परिसर)'
    },
    lat: 19.0728,
    lng: 72.8711,
    order: 2,
    note: 'TODO(content): Kalina campus coordinates to be formally verified'
  },
  {
    id: 'ANC-MAHARASHTRA',
    type: 'region' as const,
    name: {
      en: 'Coastal Maharashtra Research Arc',
      mr: 'महाराष्ट्र किनारपट्टी संशोधन क्षेत्र',
      hi: 'तटीय महाराष्ट्र अनुसंधान क्षेत्र'
    },
    lat: 18.9000,
    lng: 73.2000,
    order: 3,
    note: 'Regional camera hold center'
  }
];

// 2. Data-Driven District Anchors (Only published, verified districts)
const districtAnchors: any[] = [];
const distDir = path.join(CONTENT_DIR, 'districts');

if (fs.existsSync(distDir)) {
  const entries = fs.readdirSync(distDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  let currentOrder = 4;
  for (const slug of entries) {
    const yamlPath = path.join(distDir, slug, 'district.yaml');
    if (!fs.existsSync(yamlPath)) continue;

    try {
      const d = yaml.load(fs.readFileSync(yamlPath, 'utf-8')) as any;
      if (d && d.coordinates) {
        districtAnchors.push({
          id: `ANC-${slug.toUpperCase()}`,
          type: 'district' as const,
          slug: d.slug,
          name: d.name,
          lat: d.coordinates.lat,
          lng: d.coordinates.lng,
          order: currentOrder++,
          note: `Technical/reference implementation anchor (${slug}). Project-wide confirmed research district scope remains unresolved per Evidence Register.`
        });
      }
    } catch (err: any) {
      console.warn(`[build-story-anchors] Failed reading ${yamlPath}:`, err.message);
    }
  }
}

const payload = {
  version: '1.0.0',
  generated_at: new Date().toISOString(),
  anchors: [...baseAnchors, ...districtAnchors]
};

// Validate against schema
const parsed = storyAnchorsFileSchema.safeParse(payload);
if (!parsed.success) {
  console.error('[build-story-anchors] Validation error:', parsed.error.issues);
  process.exit(1);
}

// Ensure target directory exists
const geoDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(geoDir)) {
  fs.mkdirSync(geoDir, { recursive: true });
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2), 'utf-8');
console.log(`✅ [build-story-anchors] Generated ${payload.anchors.length} story anchors (institutional partners + technical reference districts) to ${OUTPUT_FILE}`);
