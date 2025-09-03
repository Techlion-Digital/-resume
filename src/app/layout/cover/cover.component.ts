import {
  AfterViewInit, Component, ElementRef, Inject, NgZone, OnDestroy, Renderer2, ViewChild, HostBinding, Input
} from '@angular/core';
import { Logo } from './logo/logo.component';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-cover',
  standalone: true,
  imports: [Logo],
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.css'] 
})
export class Cover implements AfterViewInit, OnDestroy {
  @ViewChild('coverSvg', { static: false }) coverSvg?: ElementRef<SVGSVGElement>;
  @Input() showtime = false;
  @HostBinding('class.showtime') get hostShow() { return this.showtime; }

  // Twinkle tuning
  private fps = 60;
  private perTick = 10;
  private minOpacity = 0.0;
  private maxOpacity = 1.0;
  private restoreDelayMin = 200;
  private restoreDelayMax = 600;

  private rafId: number | null = null;
  private lastTick = 0;
  private polygons: SVGPolygonElement[] = [];
  private restoreTimers = new WeakMap<SVGPolygonElement, number>();

  // safe rAF/cancel for SSR
  private rAF = (cb: FrameRequestCallback): number =>
    (typeof window !== 'undefined' && 'requestAnimationFrame' in window)
      ? window.requestAnimationFrame(cb)
      : (setTimeout(() => cb(performance?.now?.() ?? Date.now()), 16) as unknown as number);

  private cAF = (id: number) =>
    (typeof window !== 'undefined' && 'cancelAnimationFrame' in window)
      ? window.cancelAnimationFrame(id)
      : clearTimeout(id as unknown as number);

  constructor(
    private ngZone: NgZone,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return; // ← don’t run on server

    this.rAF(() => {
      const svg = this.coverSvg?.nativeElement;
      if (!svg) return;

      this.polygons = Array.from(svg.querySelectorAll<SVGPolygonElement>('polygon[id^="bg-"]'));
      this.ngZone.runOutsideAngular(() => this.loop());
    });
  }

  private loop = (t: number = 0) => {
    const interval = 1000 / this.fps;
    if (t - this.lastTick >= interval) {
      this.lastTick = t;
      this.twinkleBatch();
    }
    this.rafId = this.rAF(this.loop);
  };

  private twinkleBatch() {
    if (this.polygons.length === 0) return;

    for (let i = 0; i < this.perTick; i++) {
      const poly = this.polygons[Math.floor(Math.random() * this.polygons.length)];
      if (!poly) continue;

      const r = Math.random();
      const target = this.minOpacity + (this.maxOpacity - this.minOpacity) * (0.35 + 0.65 * r);
      poly.style.setProperty('opacity', target.toFixed(3), 'important');

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
    if (this.rafId != null) this.cAF(this.rafId);
    for (const poly of this.polygons) {
      const t = this.restoreTimers.get(poly);
      if (t) clearTimeout(t);
    }
    this.restoreTimers = new WeakMap<SVGPolygonElement, number>();
  }
}
