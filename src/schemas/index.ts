import { z } from 'astro/zod';

// Multilingual string schema: English mandatory; Marathi and Hindi supported with fallback flag
export const i18nStringSchema = z.object({
  en: z.string().min(1, 'English string is required'),
  mr: z.string().optional(),
  hi: z.string().optional()
});

// 1. Common Block — Mandatory on every record (doc 04)
export const commonBlockSchema = z.object({
  id: z.string().regex(/^[A-Z]{2,4}(-[A-Z]{2,4})?-\d{4}$/, 'Opaque ID format required (e.g. PLC-0001, PRJ-0001, PAL-VIL-0001)'),
  status: z.enum(['draft', 'in_review', 'verified', 'published', 'needs_correction', 'archived']),
  visibility: z.enum(['public', 'research_team', 'community_only', 'restricted', 'unpublished']),
  verification: z.object({
    level: z.enum(['verified', 'researcher_provided', 'user_provided', 'inference', 'placeholder']),
    verified_by: z.string().min(1, 'Named verifier is required'),
    verified_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD date required')
  }),
  evidence: z.array(z.string()).default([]),
  created_by: z.string().optional(),
  created_on: z.string().optional(),
  updated_on: z.string().optional()
});

// 2. Consent Block — Mandatory for people, media with people, quotes, oral history
export const consentBlockSchema = z.object({
  state: z.enum(['granted', 'pending', 'withdrawn', 'not_required']),
  scope: z.array(z.enum(['name', 'photo', 'quote', 'story', 'video'])).default([]),
  form_id: z.string().optional(),
  obtained_on: z.string().optional(),
  obtained_by: z.string().optional(),
  guardian_consent: z.boolean().default(false)
});

// 3. District Schema
export const districtSchema = z.object({
  slug: z.string().min(1),
  name: i18nStringSchema,
  theme: z.string().min(1),
  tagline: i18nStringSchema,
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }),
  hero: z.object({
    image: z.string(),
    alt: i18nStringSchema,
    credit: z.string()
  }),
  research_period: z.object({
    start: z.string(),
    end: z.string().optional()
  }),
  highlights: z.array(i18nStringSchema).optional()
});

// 4. Village / Place Schema
export const villageSchema = commonBlockSchema.extend({
  slug: z.string().min(1),
  district: z.string().min(1),
  name: i18nStringSchema,
  community_type: z.enum(['fishing', 'tribal', 'farming', 'mixed', 'urban', 'other']),
  geography: z.object({
    administrative_district: z.string().min(1),
    municipal_area: z.string().optional(),
    locality: z.string().optional()
  }),
  project: z.object({
    research_district: z.string().min(1),
    classification_source: z.string().optional(),
    classification_confirmed: z.boolean().default(false)
  }),
  livelihoods: z.array(z.string()).default([]),
  about: z.object({
    documented_source: i18nStringSchema.optional(),
    community_account: i18nStringSchema.optional()
  }),
  how_to_reach: i18nStringSchema.optional(),
  sensitive_location: z.boolean().default(false),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
    precision: z.enum(['exact', 'coarse', 'district_only']).default('coarse')
  }).optional(),
  local_authority: z.object({
    body: z.string(),
    contact_public: z.boolean().default(false)
  }).optional(),
  people: z.array(z.string()).default([])
});

// 5. Person Schema (Strict Consent Gating & Scalable Roles)
export const personSchema = commonBlockSchema.extend({
  role: z.union([i18nStringSchema, z.string()]),
  name: i18nStringSchema,
  community: z.object({
    district_id: z.string(),
    village_id: z.string().optional()
  }).optional(),
  district_id: z.string().optional(),
  village_id: z.string().optional(),
  photo: z.string().optional(),
  photo_credit: z.string().optional(),
  photo_alt: i18nStringSchema.optional(),
  bio: i18nStringSchema.optional(),
  consent: consentBlockSchema
});

// 6. Survey Schema (Aggregated only)
export const surveySchema = commonBlockSchema.extend({
  project: z.string().default('PRJ-0001'),
  places: z.array(z.string()).min(1),
  title: i18nStringSchema,
  method: z.enum(['household', 'FGD', 'interview', 'transect', 'audit']),
  dates: z.object({
    start: z.string(),
    end: z.string()
  }),
  sample: z.object({
    n: z.number(),
    description: i18nStringSchema
  }),
  findings: z.array(z.object({
    indicator: z.string(),
    text: i18nStringSchema,
    evidence: z.array(z.string()).default([]),
    metrics: z.record(z.union([z.number(), z.string()])).optional()
  })),
  downloads: z.array(z.object({
    label: i18nStringSchema,
    file: z.string(),
    type: z.enum(['pdf', 'csv'])
  })).default([])
});

// 7. Species Observation Schema
export const speciesSchema = commonBlockSchema.extend({
  kind: z.enum(['flora', 'fauna']),
  common_name: z.object({
    en: z.string(),
    mr: z.string().optional(),
    hi: z.string().optional(),
    local: z.string().optional()
  }),
  scientific_name: z.string(),
  iucn_status: z.enum(['LC', 'NT', 'VU', 'EN', 'CR', 'DD', 'NE']),
  habitat: i18nStringSchema,
  observed_on: z.string(),
  observed_by: z.string(),
  places: z.array(z.string()),
  precision: z.enum(['exact', 'coarse', 'district_only']).default('coarse'),
  photos: z.array(z.string()).default([])
});

// 8. Challenge, Response & Outcome Schema
export const challengeSchema = commonBlockSchema.extend({
  project: z.string().default('PRJ-0001'),
  places: z.array(z.string()).min(1),
  category: z.enum(['flooding', 'heat', 'erosion', 'water', 'waste', 'livelihood', 'biodiversity', 'infrastructure', 'other']),
  title: i18nStringSchema,
  observed_by_researchers: i18nStringSchema,
  community_perspectives: i18nStringSchema.optional(),
  existing_responses: i18nStringSchema.optional(),
  interventions: z.array(z.object({
    id: z.string(),
    type: z.enum(['community', 'student_led', 'institutional', 'proposed', 'ongoing', 'completed']),
    description: i18nStringSchema,
    outcome: z.object({
      measured: i18nStringSchema,
      as_of: z.string(),
      evidence: z.array(z.string())
    }).optional()
  })).default([])
});

// 9. Heritage Schema
export const heritageSchema = commonBlockSchema.extend({
  places: z.array(z.string()).min(1),
  type: z.enum(['archaeological', 'cultural', 'historical', 'architectural', 'natural']),
  period: z.string().optional(),
  title: i18nStringSchema,
  description: i18nStringSchema,
  source_type: z.enum(['documented_source', 'community_account', 'researcher_observation']),
  sources: z.array(z.string()),
  precision: z.enum(['exact', 'coarse']).default('coarse'),
  permission_note: z.string().optional()
});

// 10. Media Schema
export const mediaSchema = commonBlockSchema.extend({
  file: z.string(),
  caption: i18nStringSchema,
  alt: i18nStringSchema,
  title: i18nStringSchema,
  photographer: z.string(),
  date: z.string(),
  location_coarse: z.string(),
  district_id: z.string(),
  village_id: z.string().optional(),
  shows_people: z.boolean().default(false),
  minors_visible: z.boolean().default(false),
  consent: consentBlockSchema.optional()
});

// 11. Product Schema (Enquiry Catalogue)
export const productSchema = commonBlockSchema.extend({
  district_id: z.string(),
  village_id: z.string().optional(),
  name: i18nStringSchema,
  maker: z.object({
    name: i18nStringSchema,
    consent_id: z.string()
  }),
  description: i18nStringSchema,
  provenance: i18nStringSchema,
  status: z.enum(['enquiry_only', 'available', 'out_of_stock']),
  enquiry_url: z.string().optional()
});

// 12. Evidence Claim Schema (doc 10)
export const evidenceSchema = z.object({
  id: z.string().regex(/^EV-\d{4}$/, 'EV-XXXX format required'),
  claim: i18nStringSchema,
  type: z.enum([
    'official_document',
    'academic_publication',
    'field_survey',
    'interview',
    'community_account',
    'photographic_evidence',
    'geospatial_dataset',
    'government_dataset',
    'institutional_record',
    'researcher_observation',
    'secondary_source'
  ]),
  source: z.string(),
  method: z.string().optional(),
  researcher: z.string().optional(),
  state: z.enum(['pending_verification', 'researcher_verified', 'verified', 'conflicted', 'withdrawn', 'archived']),
  verified_by: z.string().optional(),
  verified_on: z.string().optional(),
  conflicts_with: z.array(z.string()).default([])
});

// 13. Story Anchor Schema (for public/geo/story-anchors.json)
// Guaranteed to contain zero PII, zero unconsented data, zero findings
export const storyAnchorSchema = z.object({
  id: z.string(),
  type: z.enum(['partner', 'district', 'region']),
  slug: z.string().optional(),
  name: i18nStringSchema,
  lat: z.number(),
  lng: z.number(),
  order: z.number(),
  note: z.string().optional()
});

export const storyAnchorsFileSchema = z.object({
  version: z.string(),
  generated_at: z.string(),
  anchors: z.array(storyAnchorSchema)
});
