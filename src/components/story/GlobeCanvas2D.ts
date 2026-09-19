import * as d3Geo from 'd3-geo';
import * as topojson from 'topojson-client';

interface Anchor {
  id: string;
  type: string;
  name: { en: string; mr?: string; hi?: string };
  lat: number;
  lng: number;
  order: number;
}

export class GlobeCanvas2D {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number = 0;
  private height: number = 0;
  private projection: d3Geo.GeoProjection;
  private pathGenerator: d3Geo.GeoPath;
  private landData: any = null;
  private anchors: Anchor[] = [];
  private currentProgress: number = 0;
  private isDestroyed: boolean = false;
  private lang: string = 'en';

  constructor(canvas: HTMLCanvasElement, lang: string = 'en') {
    this.canvas = canvas;
    this.lang = lang;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) throw new Error('2D context not available');
    this.ctx = ctx;

    this.projection = d3Geo.geoOrthographic().clipAngle(90);
    this.pathGenerator = d3Geo.geoPath(this.projection, this.ctx);

    this.resize();
  }

  public async init(): Promise<void> {
    try {
      // Fetch public domain Natural Earth land geometry and story anchors concurrently
      const [landRes, anchorsRes] = await Promise.all([
        fetch('/geo/land-110m.json'),
        fetch('/geo/story-anchors.json')
      ]);

      if (!landRes.ok || !anchorsRes.ok) {
        throw new Error('Failed to load geographic assets');
      }

      const rawLand = await landRes.json();
      const rawAnchors = await anchorsRes.json();

      this.landData = topojson.feature(rawLand, rawLand.objects.land as any);
      this.anchors = rawAnchors.anchors || [];

      this.render();
    } catch (err) {
      console.warn('[GlobeCanvas2D] Initialisation error, falling back to static:', err);
      throw err;
    }
  }

  public resize(): void {
    const parent = this.canvas.parentElement;
    const rect = parent?.getBoundingClientRect();
    const parentWidth = (rect && rect.width > 0) ? rect.width : (parent?.clientWidth || 400);
    const parentHeight = (rect && rect.height > 0) ? rect.height : (parent?.clientHeight || 400);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.width = Math.max(parentWidth, 240);
    this.height = Math.min(Math.max(parentHeight, 240), 600);

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(dpr, dpr);

    const radius = Math.min(this.width, this.height) * 0.40;
    this.projection
      .scale(radius)
      .translate([this.width / 2, this.height / 2]);

    this.render();
  }

  public setProgress(progress: number): void {
    this.currentProgress = Math.max(0, Math.min(1, progress));
    this.render();
  }

  private interpolate(start: number, end: number, t: number): number {
    return start + (end - start) * t;
  }

  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  public render(): void {
    if (this.isDestroyed || !this.ctx || !this.landData) return;

    // Center coordinates [lng, lat]
    // Start: UK / Bristol (-2.60, 51.46)
    // End: Maharashtra Coast / Mumbai (72.87, 19.07) -> Palghar region (73.0, 19.4)
    let centerLng = -2.6;
    let centerLat = 51.5;

    const p = this.currentProgress;
    const baseRadius = Math.min(this.width, this.height) * 0.39;
    let currentScale = baseRadius;

    if (p < 0.18) {
      // UK Focus
      centerLng = -2.6;
      centerLat = 51.5;
      currentScale = baseRadius;
    } else if (p < 0.62) {
      // Smooth eased transition UK -> Mumbai
      const t = this.easeInOutCubic((p - 0.18) / 0.44);
      centerLng = this.interpolate(-2.6, 72.87, t);
      centerLat = this.interpolate(51.5, 19.07, t);
      currentScale = baseRadius;
    } else {
      // Held View over Maharashtra Coast with subtle progressive zoom into coastal belt
      centerLng = 73.0;
      centerLat = 19.2;
      const zoomT = this.easeInOutCubic((p - 0.62) / 0.38);
      currentScale = baseRadius * (1 + 0.38 * zoomT);
    }

    // d3-geo projection rotation is [-lambda, -phi] to center on [lng, lat]
    this.projection
      .scale(currentScale)
      .rotate([-centerLng, -centerLat]);

    this.ctx.clearRect(0, 0, this.width, this.height);

    const center = [this.width / 2, this.height / 2];
    const radius = currentScale;

    // 0. Atmospheric Halo (Soft outer planetary limb glow)
    const haloGrad = this.ctx.createRadialGradient(
      center[0], center[1], radius * 0.94,
      center[0], center[1], radius * 1.08
    );
    haloGrad.addColorStop(0, 'rgba(56, 189, 248, 0.40)');
    haloGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.18)');
    haloGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');

    this.ctx.beginPath();
    this.ctx.arc(center[0], center[1], radius * 1.08, 0, Math.PI * 2);
    this.ctx.fillStyle = haloGrad;
    this.ctx.fill();

    // 1. Deep Ocean Disc with Rich Hydrographic Depth
    const oceanGrad = this.ctx.createRadialGradient(
      center[0] - radius * 0.32, center[1] - radius * 0.32, radius * 0.08,
      center[0], center[1], radius
    );
    oceanGrad.addColorStop(0, '#1E40AF');   // vibrant deep sea blue
    oceanGrad.addColorStop(0.35, '#1D4ED8'); // mid-ocean depth
    oceanGrad.addColorStop(0.75, '#0F2C69'); // oceanic trench
    oceanGrad.addColorStop(1, '#08173B');    // limb darkening

    this.ctx.beginPath();
    this.ctx.arc(center[0], center[1], radius, 0, Math.PI * 2);
    this.ctx.fillStyle = oceanGrad;
    this.ctx.fill();

    // 2. Graticule Lines (Fine astronomical latitude & longitude grid)
    this.ctx.beginPath();
    this.pathGenerator(d3Geo.geoGraticule10());
    this.ctx.strokeStyle = '#38BDF8';
    this.ctx.lineWidth = 0.5;
    this.ctx.globalAlpha = 0.22;
    this.ctx.stroke();
    this.ctx.globalAlpha = 1.0;

    // 3. Coastal Shelf Buffer (Subtle shallow-water turquoise glow around landmasses)
    this.ctx.beginPath();
    this.pathGenerator(this.landData);
    this.ctx.strokeStyle = 'rgba(20, 184, 166, 0.35)'; // Teal coastal shelf
    this.ctx.lineWidth = 3.5;
    this.ctx.stroke();

    // 4. Real Earth Landmasses with Lush Terrestrial Greenery
    const landGrad = this.ctx.createLinearGradient(
      center[0] - radius, center[1] - radius,
      center[0] + radius, center[1] + radius
    );
    landGrad.addColorStop(0, '#2D6A4F');   // lush forest canopy green
    landGrad.addColorStop(0.45, '#40916C'); // rich vegetation green
    landGrad.addColorStop(0.85, '#52B788'); // vibrant coastal greenery
    landGrad.addColorStop(1, '#1B4332');    // deep estuarine mangrove green

    this.ctx.beginPath();
    this.pathGenerator(this.landData);
    this.ctx.fillStyle = landGrad;
    this.ctx.fill();
    this.ctx.strokeStyle = '#1B4332';
    this.ctx.lineWidth = 0.8;
    this.ctx.stroke();

    // 5. Regional Konkan / Maharashtra Coastal Biodiversity Belt Highlight
    if (p > 0.40) {
      const beltFade = Math.min(1, (p - 0.40) / 0.25);
      // Polygon approximating the Konkan coastal/mangrove corridor & Western Ghats bio-shield
      const konkanCorridor: any = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [72.6, 20.2],
            [73.3, 20.2],
            [73.8, 18.2],
            [73.1, 18.2],
            [72.6, 20.2]
          ]]
        }
      };

      this.ctx.beginPath();
      this.pathGenerator(konkanCorridor);
      this.ctx.fillStyle = `rgba(16, 185, 129, ${0.40 * beltFade})`; // Vibrant emerald coastal belt
      this.ctx.fill();
      this.ctx.strokeStyle = `rgba(5, 150, 105, ${0.65 * beltFade})`;
      this.ctx.lineWidth = 1.2;
      this.ctx.stroke();

      // Stylized estuarine river network (Vaitarna & Ulhas basins)
      const riverFeature: any = {
        type: 'Feature',
        geometry: {
          type: 'MultiLineString',
          coordinates: [
            [[73.3, 19.9], [72.9, 19.7], [72.76, 19.69]], // Vaitarna River to coast
            [[73.4, 19.2], [73.1, 19.25], [72.85, 19.3]]  // Ulhas Estuary
          ]
        }
      };
      this.ctx.beginPath();
      this.pathGenerator(riverFeature);
      this.ctx.strokeStyle = `rgba(56, 189, 248, ${0.85 * beltFade})`; // Estuarine freshwater pulse
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();
    }

    // 6. Bilateral Partnership Great Circle Arc (University of Bristol -> University of Mumbai)
    const bristolCoord: [number, number] = [-2.6030, 51.4584];
    const mumbaiCoord: [number, number] = [72.8711, 19.0728];

    const arcFeature: any = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [bristolCoord, mumbaiCoord]
      }
    };

    this.ctx.beginPath();
    this.pathGenerator(arcFeature);
    this.ctx.strokeStyle = '#F59E0B'; // Warm amber/gold bilateral research arc
    this.ctx.lineWidth = 2.2;
    this.ctx.setLineDash([4, 4]);
    this.ctx.stroke();
    this.ctx.setLineDash([]); // Reset dash

    // 7. Volumetric 3D Spherical Solar Lighting & Limb Darkening (authentic planetary depth)
    const sunLightGrad = this.ctx.createRadialGradient(
      center[0] - radius * 0.35, center[1] - radius * 0.35, radius * 0.1,
      center[0], center[1], radius
    );
    sunLightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.22)'); // Solar specular highlight
    sunLightGrad.addColorStop(0.40, 'rgba(255, 255, 255, 0.02)');
    sunLightGrad.addColorStop(0.75, 'rgba(0, 10, 30, 0.22)');
    sunLightGrad.addColorStop(1, 'rgba(0, 6, 20, 0.70)'); // Deep volumetric limb shadow

    this.ctx.beginPath();
    this.ctx.arc(center[0], center[1], radius, 0, Math.PI * 2);
    this.ctx.fillStyle = sunLightGrad;
    this.ctx.fill();

    // Sphere border edge
    this.ctx.beginPath();
    this.ctx.arc(center[0], center[1], radius, 0, Math.PI * 2);
    this.ctx.strokeStyle = 'rgba(147, 197, 253, 0.55)';
    this.ctx.lineWidth = 1.2;
    this.ctx.stroke();

    // 8. Story Anchors Plotting (Bristol UK, Mumbai CCCSS, Palghar Reference Lab)
    for (const anc of this.anchors) {
      const projected = this.projection([anc.lng, anc.lat]);
      if (!projected) continue;

      // Check if point is on visible hemisphere
      const dist = d3Geo.geoDistance([anc.lng, anc.lat], [centerLng, centerLat]);
      if (dist > Math.PI / 2) continue; // Behind the globe

      const isDistrict = anc.type === 'district';
      const isMumbai = anc.id === 'ANC-MUMBAI';

      // Outer ripple glow ring
      this.ctx.beginPath();
      this.ctx.arc(projected[0], projected[1], isDistrict ? 8 : 7, 0, Math.PI * 2);
      this.ctx.fillStyle = isDistrict
        ? 'rgba(16, 185, 129, 0.30)'
        : (isMumbai ? 'rgba(239, 68, 68, 0.30)' : 'rgba(59, 130, 246, 0.30)');
      this.ctx.fill();

      // Solid Anchor Pin
      this.ctx.beginPath();
      this.ctx.arc(projected[0], projected[1], isDistrict ? 5 : 4, 0, Math.PI * 2);
      this.ctx.fillStyle = isDistrict ? '#059669' : (isMumbai ? '#DC2626' : '#2563EB');
      this.ctx.fill();
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.lineWidth = 1.6;
      this.ctx.stroke();

      // Typography Label
      const name = (anc.name as any)[this.lang] || anc.name.en;
      this.ctx.font = isDistrict ? 'bold 12px system-ui, -apple-system, sans-serif' : '600 11px system-ui, -apple-system, sans-serif';

      // Backdrop pill for crystal-clear readability
      const textWidth = this.ctx.measureText(name).width;
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      this.ctx.fillRect(projected[0] + 6, projected[1] - 9, textWidth + 6, 15);

      this.ctx.fillStyle = '#0F172A';
      this.ctx.fillText(name, projected[0] + 9, projected[1] + 3);
    }
  }

  public destroy(): void {
    this.isDestroyed = true;
  }
}
