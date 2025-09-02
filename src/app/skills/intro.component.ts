// intro-cloud-wa.component.ts
import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, Input, NgZone, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-intro-cloud',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None, // optional, but harmless here
  template: `
    <div class="intro-cloud content-only" aria-hidden="true">
      <div #lane class="lane"></div>
    </div>
  `,
  styles: [`
    :root{
      --accent: #f4f6f3;
    }
    .intro-cloud{ position: fixed; inset: 0; z-index: 5; pointer-events: none; }
    .intro-cloud.content-only .lane{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      pointer-events: none;
    }
  `]
})
export class IntroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('lane', { static: true }) laneRef!: ElementRef<HTMLDivElement>;

  @Input() wordBank: string[] = [
    'Front-End','Back-End','DevOps','Agile','Leadership','Creativity','UX',
    'Angular','TypeScript','RxJS','SCSS', 'Performance',
    'Python','Flask','APIs','SQL','Pandas',
    'CI/CD','Testing','Windows', 'Monitoring',
    'UI','Research', 'Design','Wireframes','Prototyping','Design Systems',
    'Kanban','Scrum', 'Dashboards','Visualization','Storytelling', 'Conversion', 'Accessibility',
    'Algorithms', 'Responsive', 'Debugging', 'Database', 'Cloud', 'Linux', 'MongoDB', 'Cassandra',
    'C#', 'HTML', 'CSS', 'JavaScript', 'PHP', 'Creative Cloud', 'Figma', 'Marketing', 'React', 'Single-SPA',
    'Micro-Frontend'
  ];

  // knobs
  private maxConcurrent = 12;
  private spawnEveryMs  = 1;
  private lifeMinMs     = 1000;
  private lifeMaxMs     = 2500;
  private scaleMin      = 0.5;
  private scaleMax      = 1.5;
  private growFactorMin = 1.5;
  private growFactorMax = 2.0;
  private palette = ['#9d8cad','#a998ba','#8c7ea0','#b6a6c6','#9a87b0','#746a82','#655e6d','#5e546d','#7b6f8a','#6b627a','#ceecc5','#dcf3d5','#c7e9c6','#e7f6e3','#d6edd7'];
  private timer: number | null = null;
  private active = 0;
  private destroyed = false;
  // add a toggle
  private shatter = true;

  constructor(private zone: NgZone) {}

  ngAfterViewInit() {
    const w = this.laneRef.nativeElement.getBoundingClientRect().width;
    if (w < 540) { this.maxConcurrent = 8; this.spawnEveryMs = 600; }
    else if (w < 900) { this.maxConcurrent = 12; this.spawnEveryMs = 500; }
    // initial burst
    for (let i = 0; i < 8; i++) this.spawn(true);
    // continuous loop outside Angular for perf
    this.zone.runOutsideAngular(() => {
      this.timer = window.setInterval(() => this.spawn(), this.spawnEveryMs);
    });
  }

  ngOnDestroy() { this.cleanup(); }

  private spawn(burst = false) {
    if (this.destroyed) return;
    if (this.active >= this.maxConcurrent && !burst) return;

    const lane = this.laneRef.nativeElement;
    const rect = lane.getBoundingClientRect();
    const pad = 16;

    const text = this.wordBank[Math.floor(Math.random() * this.wordBank.length)];
    const el = document.createElement('span');
    el.textContent = text;
    el.style.color = this.palette[Math.floor(Math.random() * this.palette.length)];

    // inline critical styles so encapsulation can’t break us
    Object.assign(el.style, {
      position: 'absolute',
      fontWeight: '400',
      whiteSpace: 'nowrap',
      fontFamily: 'jaf-mashine',
      pointerEvents: 'none',
      userSelect: 'none',
      left: `${this.rand(pad, rect.width - pad)}px`,
      top:  `${this.rand(pad, rect.height - pad)}px`,
      transform: 'translate(-50%, -50%)', // we’ll append scale/rotate in animation
      opacity: '0',
    } as CSSStyleDeclaration);

    // duration / sizes / drift
    const dur = Math.round(this.rand(this.lifeMinMs, this.lifeMaxMs));
    const s0  = this.rand(this.scaleMin, this.scaleMax);
    const s1  = s0 * this.rand(this.growFactorMin, this.growFactorMax);
    const dx  = this.rand(-40, 40);
    const dy  = this.rand(-30, 20);
    const r0  = this.rand(-4, 4);
    const r1  = r0 + this.rand(-8, 8);

    // readable size, tied to start scale
    const fs = 16 + s0 * 14;
    el.style.fontSize = `clamp(14px, ${fs / 10}vw, ${Math.round(fs + 22)}px)`;
    if (this.shatter) el.style.clipPath = 'polygon(0% 0%,100% 0%,100% 100%,0% 100%)';
    lane.appendChild(el);
    this.active++;

    // Web Animations API — no CSS keyframes/classes
    const start = `translate(-50%, -50%) translate(0px, 0px) scale(${s0}) rotate(${r0}deg)`;
    const end   = `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(${s1}) rotate(${r1}deg)`;

    const anim = el.animate([
      { opacity: 0, transform: start, offset: 0 },
      { opacity: 1,   transform: start, offset: 0.12 },
      { opacity: 0, transform: end,   offset: 1 }
    ], {
      duration: dur,
      easing: 'cubic-bezier(.2,.7,.2,1)',
      fill: 'forwards'
    });

    anim.onfinish = () => {
      el.remove();
      this.active--;
      if (!this.destroyed) this.spawn(); // keep stream steady
    };
  }

  private rand(min: number, max: number) { return Math.random() * (max - min) + min; }

  private cleanup() {
    this.destroyed = true;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.active = 0;
    const lane = this.laneRef?.nativeElement;
    if (lane) Array.from(lane.children).forEach(n => n.remove());
  }
}
