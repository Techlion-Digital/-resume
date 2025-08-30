import {
  AfterViewInit, Component, ElementRef, Inject, NgZone, OnDestroy, Renderer2, ViewChild
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-backdrop',
  standalone: true,
  templateUrl: './backdrop.component.html',
  styleUrls: ['./backdrop.component.css']
})
export class Backdrop implements AfterViewInit, OnDestroy {
  @ViewChild('bgSvg', { static: false }) bgSvg?: ElementRef<SVGSVGElement>;

  // Twinkle tuning
  private fps = 60;                 // tick rate
  private perTick = 60;             // how many polygons per tick
  private minOpacity = 0.15;        // never fully disappear
  private maxOpacity = 1.0;         // max (we set <1 on twinkle; restore sets to 1)
  private restoreDelayMin = 250;    // ms before we restore to 1
  private restoreDelayMax = 800;   // ms (randomized per twinkle)

  private rafId: number | null = null; 
  private lastTick = 0;

  // Track polygons & restore timers
  private polygons: SVGPolygonElement[] = [];
  private restoreTimers = new WeakMap<SVGPolygonElement, number>();

  constructor(
    private ngZone: NgZone,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    requestAnimationFrame(() => {
      const svg = this.bgSvg?.nativeElement;
      if (!svg) return;

      // Collect polygons (ids bg-1..bg-180)
      this.polygons = Array.from(
        svg.querySelectorAll<SVGPolygonElement>('polygon[id^="bg-"]')
      );

      // Start the twinkle loop
      this.ngZone.runOutsideAngular(() => this.loop());
    });
  }

  private loop = (t: number = 0) => {
    const interval = 1000 / this.fps;
    if (t - this.lastTick >= interval) {
      this.lastTick = t;
      this.twinkleBatch();
    }
    this.rafId = requestAnimationFrame(this.loop);
  };

  private twinkleBatch() {
    if (this.polygons.length === 0) return;

    for (let i = 0; i < this.perTick; i++) {
      // pick a random polygon
      const poly = this.polygons[Math.floor(Math.random() * this.polygons.length)];
      if (!poly) continue;

      // set a random opacity (biased a bit brighter)
      const r = Math.random();
      const target = this.minOpacity + (this.maxOpacity - this.minOpacity) * (0.35 + 0.65 * r);
      poly.style.setProperty('opacity', target.toFixed(3), 'important');

      // schedule restore to 1.0 shortly after (reset if already scheduled)
      const prev = this.restoreTimers.get(poly);
      if (prev) clearTimeout(prev);

      const delay = this.restoreDelayMin + Math.random() * (this.restoreDelayMax - this.restoreDelayMin);
      const timer = window.setTimeout(() => {
        poly.style.setProperty('opacity', '1', 'important');
        this.restoreTimers.delete(poly);
      }, delay);

      this.restoreTimers.set(poly, timer);
    }
  }

  
  ngOnDestroy(): void {
    if (this.rafId != null) cancelAnimationFrame(this.rafId);

    // WeakMap isn't iterable, so iterate polygons and clear if present
    for (const poly of this.polygons) {
      const t = this.restoreTimers.get(poly);
      if (t) clearTimeout(t);
    }
    // reset
    this.restoreTimers = new WeakMap<SVGPolygonElement, number>();
  }
}
