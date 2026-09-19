/**
 * GlobeWebGL.ts
 * Tier 1 & Tier 2: Physically plausible documentary 3D Earth using Three.js.
 * Features procedural natural satellite texture, atmospheric Rayleigh scattering,
 * subtle cloud layer, directional solar day/night terminator, and rolling FPS downgrade guard.
 */

import * as THREE from 'three';
import * as topojson from 'topojson-client';

import { type ChoreographyKey, type StoryAnchor, STORY_KEYS } from './StoryTypes';

export { type ChoreographyKey, type StoryAnchor, STORY_KEYS };

export class GlobeWebGL {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private pivot: THREE.Group;
  private group: THREE.Group;
  private globeMesh: THREE.Mesh | null = null;
  private cloudMesh: THREE.Mesh | null = null;
  private atmoMesh: THREE.Mesh | null = null;
  private arcLine: THREE.Line | null = null;
  private arcMat: THREE.LineBasicMaterial | null = null;

  private isDestroyed: boolean = false;
  private isTier1: boolean = true;
  private isNarrow: boolean = false;
  private textureWidth: number = 2048;

  private progress: number = 0;
  private idleAngle: number = 0;
  private lastTime: number = performance.now();
  private frameCount: number = 0;
  private frameDeltas: number[] = [];
  private hasBenchmarked: boolean = false;

  private onDowngradeCallback?: () => void;
  private onFpsUpdate?: (fps: number) => void;

  private anchors: StoryAnchor[] = [];
  private keys: ChoreographyKey[] = [];

  private visW: number = 1;
  private visH: number = 1;
  private baseScale: number = 1;

  constructor(
    canvas: HTMLCanvasElement,
    options: {
      isTier1?: boolean;
      isNarrow?: boolean;
      anchors?: StoryAnchor[];
      keys?: ChoreographyKey[];
      onDowngrade?: () => void;
      onFpsUpdate?: (fps: number) => void;
    } = {}
  ) {
    this.canvas = canvas;
    this.isTier1 = options.isTier1 ?? true;
    this.isNarrow = options.isNarrow ?? false;
    this.textureWidth = this.isTier1 ? 2048 : 1024;
    this.anchors = options.anchors || [];
    this.keys = options.keys || [];
    this.onDowngradeCallback = options.onDowngrade;
    this.onFpsUpdate = options.onFpsUpdate;

    // 1. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: this.isTier1,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.isTier1 ? 2 : 1.5));

    // 2. Camera & Scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    this.camera.position.set(0, 0, 5.8);

    this.pivot = new THREE.Group();
    this.group = new THREE.Group();
    this.pivot.add(this.group);
    this.scene.add(this.pivot);

    // 3. Lighting
    this.scene.add(new THREE.AmbientLight(0x6f8fa0, 0.55));
    const sun = new THREE.DirectionalLight(0xfff2dc, 1.25);
    sun.position.set(-2.8, 1.2, 3.2);
    this.scene.add(sun);

    this.resize();
  }

  public async init(): Promise<void> {
    try {
      const landRes = await fetch('/geo/land-110m.json');
      if (!landRes.ok) throw new Error('Failed to load land geometry');
      const rawLand = await landRes.json();
      const landGeo = topojson.feature(rawLand, rawLand.objects.land as any) as any;

      // 1. Build Earth Procedural Texture
      const earthTexCanvas = this.buildEarthTexture(this.textureWidth, landGeo);
      const earthTex = new THREE.CanvasTexture(earthTexCanvas);
      earthTex.anisotropy = this.isTier1 ? 4 : 1;

      // 2. Globe Sphere Mesh
      const sphereSegments = this.isTier1 ? 64 : 44;
      const sphereRings = this.isTier1 ? 48 : 32;
      this.globeMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1, sphereSegments, sphereRings),
        new THREE.MeshPhongMaterial({
          map: earthTex,
          shininess: 7,
          specular: new THREE.Color(0x133845)
        })
      );
      this.group.add(this.globeMesh);

      // 3. Subtle Procedural Cloud Shell
      const cloudTexCanvas = this.buildCloudTexture(this.textureWidth / 2);
      const cloudTex = new THREE.CanvasTexture(cloudTexCanvas);
      this.cloudMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1.018, sphereSegments, sphereRings),
        new THREE.MeshPhongMaterial({
          map: cloudTex,
          transparent: true,
          opacity: 0.22,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      this.group.add(this.cloudMesh);

      // 4. Atmospheric Rayleigh Scattering Rim Shader
      this.atmoMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1.036, 44, 32),
        new THREE.ShaderMaterial({
          transparent: true,
          side: THREE.BackSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          vertexShader: `
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.6);
              gl_FragColor = vec4(0.30, 0.68, 0.78, 1.0) * clamp(intensity, 0.0, 1.0) * 0.85;
            }
          `
        })
      );
      this.group.add(this.atmoMesh);

      // 5. Bilateral Partnership Great-Circle Arc (Bristol -> Mumbai)
      this.arcMat = new THREE.LineBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0
      });
      const arcGeom = this.createGreatCircle(51.4584, -2.6030, 19.0728, 72.8711);
      this.arcLine = new THREE.Line(arcGeom, this.arcMat);
      this.group.add(this.arcLine);

      this.render();
    } catch (err) {
      console.warn('[GlobeWebGL] Initialization failed, triggering downgrade:', err);
      this.downgrade();
    }
  }

  private buildEarthTexture(W: number, landGeo: any): HTMLCanvasElement {
    const H = W / 2;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d');
    if (!ctx) return c;

    // Ocean Gradient with Realistic Bathymetry
    const og = ctx.createLinearGradient(0, 0, 0, H);
    og.addColorStop(0, '#0a2b38');
    og.addColorStop(0.35, '#0f4152');
    og.addColorStop(0.50, '#115266');
    og.addColorStop(0.65, '#0f4152');
    og.addColorStop(1, '#0a2b38');
    ctx.fillStyle = og;
    ctx.fillRect(0, 0, W, H);

    // Natural Terrestrial Vegetation Palette
    const lg = ctx.createLinearGradient(0, 0, 0, H);
    lg.addColorStop(0, '#98A086');
    lg.addColorStop(0.20, '#52B788');
    lg.addColorStop(0.48, '#2D6A4F');
    lg.addColorStop(0.65, '#40916C');
    lg.addColorStop(0.85, '#8A8F6E');
    lg.addColorStop(1, '#C3C6B4');

    const px = (lng: number) => ((lng + 180) / 360) * W;
    const py = (lat: number) => ((90 - lat) / 180) * H;

    ctx.lineJoin = 'round';

    // Render polygon rings from GeoJSON
    if (landGeo && landGeo.features) {
      for (const feature of landGeo.features) {
        const geom = feature.geometry;
        const coordinates = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;

        for (const poly of coordinates) {
          const ring = poly[0];
          if (!ring || ring.length === 0) continue;

          // Unwrap longitudes across the antimeridian
          const pts: [number, number][] = [];
          let prev = ring[0][0];
          let acc = 0;
          for (let i = 0; i < ring.length; i++) {
            const l = ring[i][0];
            const d = l - prev;
            if (d > 180) acc -= 360;
            else if (d < -180) acc += 360;
            prev = l;
            pts.push([l + acc, ring[i][1]]);
          }

          for (const off of [-360, 0, 360]) {
            ctx.beginPath();
            for (let i = 0; i < pts.length; i++) {
              const sx = px(pts[i][0] + off);
              const sy = py(pts[i][1]);
              if (i === 0) ctx.moveTo(sx, sy);
              else ctx.lineTo(sx, sy);
            }
            ctx.closePath();
            ctx.fillStyle = lg;
            ctx.fill();
            ctx.strokeStyle = 'rgba(20, 184, 166, 0.40)'; // Coastal shelf buffer
            ctx.lineWidth = Math.max(1, W / 1400);
            ctx.stroke();
          }
        }
      }
    }

    // Natural documentary surface grain
    const n = (W * H) / 900;
    for (let i = 0; i < n; i++) {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.05})`;
      ctx.fillRect(Math.random() * W, Math.random() * H, 1.6, 1.6);
    }

    return c;
  }

  private buildCloudTexture(W: number): HTMLCanvasElement {
    const H = W / 2;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d');
    if (!ctx) return c;

    ctx.clearRect(0, 0, W, H);

    // Wispy atmospheric cloud bands
    for (let i = 0; i < 48; i++) {
      const cy = Math.random() * H;
      const cx = Math.random() * W;
      const rad = 25 + Math.random() * 80;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      grad.addColorStop(0, `rgba(255, 255, 255, ${0.12 + Math.random() * 0.15})`);
      grad.addColorStop(0.6, `rgba(255, 255, 255, 0.05)`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    return c;
  }

  private createGreatCircle(la1: number, lo1: number, la2: number, lo2: number): THREE.BufferGeometry {
    const g = new THREE.BufferGeometry();
    const pts: THREE.Vector3[] = [];
    const N = 64;
    const phi1 = (la1 * Math.PI) / 180;
    const lam1 = (lo1 * Math.PI) / 180;
    const phi2 = (la2 * Math.PI) / 180;
    const lam2 = (lo2 * Math.PI) / 180;

    const d =
      2 *
      Math.asin(
        Math.sqrt(
          Math.pow(Math.sin((phi1 - phi2) / 2), 2) +
            Math.cos(phi1) * Math.cos(phi2) * Math.pow(Math.sin((lam1 - lam2) / 2), 2)
        )
      );

    for (let i = 0; i <= N; i++) {
      const f = i / N;
      const A = Math.sin((1 - f) * d) / Math.sin(d);
      const B = Math.sin(f * d) / Math.sin(d);
      const x = A * Math.cos(phi1) * Math.cos(lam1) + B * Math.cos(phi2) * Math.cos(lam2);
      const y = A * Math.cos(phi1) * Math.sin(lam1) + B * Math.cos(phi2) * Math.sin(lam2);
      const z = A * Math.sin(phi1) + B * Math.sin(phi2);
      const lat = (Math.atan2(z, Math.sqrt(x * x + y * y)) * 180) / Math.PI;
      const lng = (Math.atan2(y, x) * 180) / Math.PI;
      const lift = 1.02 + 0.10 * Math.sin(Math.PI * f);
      pts.push(this.latLngToVector(lat, lng, lift));
    }

    g.setFromPoints(pts);
    return g;
  }

  private latLngToVector(lat: number, lng: number, r: number): THREE.Vector3 {
    const phi = ((lng + 180) * Math.PI) / 180;
    const theta = ((90 - lat) * Math.PI) / 180;
    return new THREE.Vector3(
      -r * Math.cos(phi) * Math.sin(theta),
      r * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta)
    );
  }

  public resize(): void {
    const parent = this.canvas.parentElement;
    const w = parent?.clientWidth || window.innerWidth;
    const h = parent?.clientHeight || window.innerHeight;

    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    this.visH = 2 * Math.tan((this.camera.fov * Math.PI) / 360) * this.camera.position.z;
    this.visW = this.visH * this.camera.aspect;
    this.baseScale = 0.40 * Math.min(this.visW, this.visH);
    this.isNarrow = window.matchMedia('(max-width: 860px)').matches;

    this.render();
  }

  public setProgress(progress: number): void {
    this.progress = Math.max(0, Math.min(1, progress));
    this.render();
  }

  private ease(t: number): number {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  private lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  private lerpAngle(a: number, b: number, t: number): number {
    const d = (((b - a + 540) % 360) - 180);
    return a + d * t;
  }

  private sampleChoreography(p: number) {
    if (!this.keys || this.keys.length < 2) {
      return { lat: 22, lng: -24, s: 1.0, ox: 0, oy: 0 };
    }

    for (let i = 0; i < this.keys.length - 1; i++) {
      const k = this.keys[i];
      const n = this.keys[i + 1];
      if (p <= n.p || i === this.keys.length - 2) {
        const span = n.p - k.p || 0.001;
        const t = this.ease(Math.max(0, Math.min(1, (p - k.p) / span)));
        return {
          lat: this.lerp(k.lat, n.lat, t),
          lng: this.lerpAngle(k.lng, n.lng, t),
          s: this.lerp(k.s, n.s, t),
          ox: this.lerp(k.ox, n.ox, t),
          oy: this.lerp(k.oy, n.oy, t)
        };
      }
    }

    return this.keys[0];
  }

  public render(): void {
    if (this.isDestroyed || !this.globeMesh) return;

    const now = performance.now();
    const dt = now - this.lastTime;
    this.lastTime = now;

    // Subtle continuous idle rotation
    this.idleAngle += 0.00015;
    if (this.cloudMesh) {
      this.cloudMesh.rotation.y += 0.00025;
    }

    const st = this.sampleChoreography(this.progress);

    // Apply viewport position offset & scale
    const ox = this.isNarrow ? 0 : st.ox;
    const oy = this.isNarrow ? (this.progress > 0.12 ? 0.16 : 0) : st.oy;
    const s = this.isNarrow ? (this.progress > 0.12 ? st.s * 0.85 : st.s) : st.s;

    this.pivot.position.set(ox * this.visW, oy * this.visH, 0);
    this.group.scale.setScalar(this.baseScale * s);

    // Convert geographic coordinates to spherical rotation
    const rotLat = (st.lat * Math.PI) / 180;
    const rotLng = Math.PI / 2 - ((st.lng + 180) * Math.PI) / 180 + this.idleAngle;
    this.group.rotation.set(rotLat, rotLng, 0);

    // Bilateral Arc visibility (illuminates during Scenes 04–06)
    if (this.arcMat) {
      this.arcMat.opacity =
        Math.max(0, Math.min(1, (this.progress - 0.35) / 0.10)) *
        (1 - Math.max(0, (this.progress - 0.75) / 0.10)) *
        0.90;
    }

    this.renderer.render(this.scene, this.camera);

    // Project Story Markers to DOM
    this.updateDomMarkers();

    // 90-Frame Benchmark for Automatic Performance Downgrade
    this.benchmarkPerformance(dt);
  }

  private updateDomMarkers(): void {
    const rect = this.canvas.getBoundingClientRect();
    const tmp = new THREE.Vector3();

    for (const a of this.anchors) {
      if (!a.el) continue;
      const on = this.progress >= a.from;
      const v = this.latLngToVector(a.lat, a.lng, 1.015);
      v.applyMatrix4(this.group.matrixWorld);

      // Normal dot product with camera direction for back-side culling
      const normal = this.latLngToVector(a.lat, a.lng, 1.0)
        .applyMatrix4(this.group.matrixWorld)
        .sub(this.pivot.position)
        .normalize();

      const facing = normal.dot(new THREE.Vector3(0, 0, 1)) > 0.08;

      tmp.copy(v).project(this.camera);
      a.el.style.left = `${((tmp.x * 0.5 + 0.5) * rect.width)}px`;
      a.el.style.top = `${((-tmp.y * 0.5 + 0.5) * rect.height)}px`;
      a.el.style.opacity = (on && facing) ? '1' : '0';
    }
  }

  private benchmarkPerformance(dt: number): void {
    if (this.hasBenchmarked) return;

    this.frameDeltas.push(dt);
    this.frameCount++;

    if (this.frameCount === 90) {
      this.hasBenchmarked = true;
      const sorted = [...this.frameDeltas].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
      const measuredFps = 1000 / (median || 16.6);

      if (this.onFpsUpdate) this.onFpsUpdate(Math.round(measuredFps));

      // Auto-downgrade to Tier 3 if median frame time > 33ms (< 30 FPS)
      if (median > 33.3) {
        console.warn(`[GlobeWebGL] Low performance detected (${measuredFps.toFixed(1)} FPS). Auto-downgrading to Tier 3.`);
        this.downgrade();
      }
    }
  }

  private downgrade(): void {
    this.destroy();
    if (this.onDowngradeCallback) {
      this.onDowngradeCallback();
    }
  }

  public destroy(): void {
    this.isDestroyed = true;
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.globeMesh) {
      this.globeMesh.geometry.dispose();
      (this.globeMesh.material as THREE.Material).dispose();
    }
    if (this.cloudMesh) {
      this.cloudMesh.geometry.dispose();
      (this.cloudMesh.material as THREE.Material).dispose();
    }
    if (this.atmoMesh) {
      this.atmoMesh.geometry.dispose();
      (this.atmoMesh.material as THREE.Material).dispose();
    }
    if (this.arcLine) {
      this.arcLine.geometry.dispose();
      if (this.arcMat) this.arcMat.dispose();
    }
  }
}
