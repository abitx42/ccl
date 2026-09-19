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
    const rect = this.canvas.parentElement?.getBoundingClientRect() || { width: 500, height: 500 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.width = rect.width;
    this.height = Math.min(rect.height, 600);

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(dpr, dpr);

    const radius = Math.min(this.width, this.height) * 0.42;
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
    const baseRadius = Math.min(this.width, this.height) * 0.42;
    let currentScale = baseRadius;

    if (p < 0.20) {
      // UK Focus
      centerLng = -2.6;
      centerLat = 51.5;
      currentScale = baseRadius;
    } else if (p < 0.65) {
      // Smooth eased transition UK -> Mumbai
      const t = this.easeInOutCubic((p - 0.20) / 0.45);
      centerLng = this.interpolate(-2.6, 72.87, t);
      centerLat = this.interpolate(51.5, 19.07, t);
      currentScale = baseRadius;
    } else {
      // Held View over Maharashtra Coast with subtle progressive zoom
      centerLng = 73.0;
      centerLat = 19.2;
      const zoomT = this.easeInOutCubic((p - 0.65) / 0.35);
      currentScale = baseRadius * (1 + 0.35 * zoomT);
    }

    // d3-geo projection rotation is [-lambda, -phi] to center on [lng, lat]
    this.projection
      .scale(currentScale)
      .rotate([-centerLng, -centerLat]);

    this.ctx.clearRect(0, 0, this.width, this.height);

    const center = [this.width / 2, this.height / 2];
    const radius = currentScale;

    // 1. Earth Disc & Ocean Gradient
    const oceanGrad = this.ctx.createRadialGradient(
      center[0] - radius * 0.2, center[1] - radius * 0.2, radius * 0.1,
      center[0], center[1], radius
    );
    oceanGrad.addColorStop(0, '#E0F2FE');
    oceanGrad.addColorStop(0.8, '#BAE6FD');
    oceanGrad.addColorStop(1, '#7DD3FC');

    this.ctx.beginPath();
    this.ctx.arc(center[0], center[1], radius, 0, Math.PI * 2);
    this.ctx.fillStyle = oceanGrad;
    this.ctx.fill();
    this.ctx.strokeStyle = '#94A3B8';
    this.ctx.lineWidth = 1.5;
    this.ctx.stroke();

    // 2. Graticule Lines (subtle latitude & longitude grid)
    this.ctx.beginPath();
    this.pathGenerator(d3Geo.geoGraticule10());
    this.ctx.strokeStyle = '#38BDF8';
    this.ctx.lineWidth = 0.5;
    this.ctx.globalAlpha = 0.35;
    this.ctx.stroke();
    this.ctx.globalAlpha = 1.0;

    // 3. Land Masses
    this.ctx.beginPath();
    this.pathGenerator(this.landData);
    this.ctx.fillStyle = '#CBD5E1';
    this.ctx.fill();
    this.ctx.strokeStyle = '#94A3B8';
    this.ctx.lineWidth = 0.75;
    this.ctx.stroke();

    // 4. Bilateral Partnership Great Circle Arc (Static line, NO animated particles per Rule 2)
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
    this.ctx.strokeStyle = '#1D4ED8';
    this.ctx.lineWidth = 2.0;
    this.ctx.setLineDash([4, 4]);
    this.ctx.stroke();
    this.ctx.setLineDash([]); // Reset dash

    // 5. Anchors Plotting (Bristol, Mumbai, Palghar)
    for (const anc of this.anchors) {
      const projected = this.projection([anc.lng, anc.lat]);
      if (!projected) continue;

      // Check if point is on visible hemisphere
      const dist = d3Geo.geoDistance([anc.lng, anc.lat], [centerLng, centerLat]);
      if (dist > Math.PI / 2) continue; // Behind the globe

      const isDistrict = anc.type === 'district';
      const isMumbai = anc.id === 'ANC-MUMBAI';

      // Dot
      this.ctx.beginPath();
      this.ctx.arc(projected[0], projected[1], isDistrict ? 5 : 4, 0, Math.PI * 2);
      this.ctx.fillStyle = isDistrict ? '#059669' : (isMumbai ? '#DC2626' : '#2563EB');
      this.ctx.fill();
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();

      // Label (DOM-styled typography rendered to canvas cleanly)
      const name = (anc.name as any)[this.lang] || anc.name.en;
      this.ctx.font = isDistrict ? 'bold 12px system-ui' : '600 11px system-ui';
      this.ctx.fillStyle = '#0F172A';
      this.ctx.fillText(name, projected[0] + 8, projected[1] + 4);
    }
  }

  public destroy(): void {
    this.isDestroyed = true;
  }
}
