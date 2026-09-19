/**
 * StoryTypes.ts
 * Shared choreography keyframes, anchor coordinates, and interfaces.
 * Kept strictly isolated from WebGL runtime so initial bundles remain lightweight.
 */

export interface ChoreographyKey {
  p: number;
  lat: number;
  lng: number;
  s: number;
  ox: number;
  oy: number;
}

export interface StoryAnchor {
  key: string;
  lat: number;
  lng: number;
  from: number;
  el?: HTMLElement | null;
}

export const STORY_KEYS: ChoreographyKey[] = [
  { p: 0.00, lat: 22.0, lng: -24.0, s: 1.00, ox: 0.00, oy: 0.00 },
  { p: 0.12, lat: 22.0, lng: -24.0, s: 1.00, ox: 0.00, oy: 0.00 },
  { p: 0.24, lat: 30.0, lng: -18.0, s: 0.88, ox: 0.18, oy: 0.00 },
  { p: 0.36, lat: 38.0, lng: -10.0, s: 0.82, ox: 0.20, oy: 0.00 },
  { p: 0.48, lat: 45.0, lng: 15.0,  s: 0.76, ox: 0.20, oy: 0.00 },
  { p: 0.58, lat: 51.46, lng: -2.60, s: 0.82, ox: 0.18, oy: 0.00 },
  { p: 0.68, lat: 19.07, lng: 72.87, s: 0.84, ox: 0.18, oy: 0.00 },
  { p: 0.76, lat: 19.35, lng: 72.90, s: 1.05, ox: 0.16, oy: 0.00 },
  { p: 0.84, lat: 19.45, lng: 72.92, s: 1.18, ox: 0.16, oy: 0.00 },
  { p: 0.91, lat: 19.55, lng: 72.85, s: 1.30, ox: 0.16, oy: 0.00 },
  { p: 0.97, lat: 19.70, lng: 72.77, s: 1.45, ox: 0.16, oy: 0.00 },
  { p: 1.00, lat: 19.60, lng: 72.80, s: 1.35, ox: 0.16, oy: 0.00 }
];
