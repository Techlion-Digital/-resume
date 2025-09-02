// cycle.directive.ts (SSR-safe)
import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[cycle]',
  standalone: true,
})
export class CycleDirective implements OnInit, OnDestroy {
  @Input() speed = 1200;

  private timerId: any = null;
  private readonly isBrowser: boolean;

  // palettes (no window access here)
  private purple  = ['#9d8cad','#a998ba','#8c7ea0','#b6a6c6','#9a87b0'];
  private purple2 = ['#746a82','#655e6d','#5e546d','#7b6f8a','#6b627a'];
  private green   = ['#ceecc5','#dcf3d5','#c7e9c6','#e7f6e3','#d6edd7'];
  private blue    = ['#dac5ef','#e5d4f4','#d2b8ea','#e9e0f8','#d8c9f0'];
  private yellow  = ['#efeefd','#e6e5f6','#f3f2ff','#e8e7f8','#f7f7ff'];
  private tanL    = ['#fdfefc'];
  private tanD    = ['#c1c1b2','#afae9e','#a3a28d'];
  private i = { g:0, y:0, b:0, p:0, p2:2, tl:0, td:0 };

  constructor(
    private el: ElementRef<HTMLElement>,
    private zone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) {
      // On the server: apply a single stable frame and exit
      this.apply();
      return;
    }

    // Browser only: start interval outside Angular
    this.apply();
    this.zone.runOutsideAngular(() => {
      this.timerId = setInterval(() => {
        this.advance();
        this.apply();
      }, Number(this.speed) || 1200);
    });
  }

  ngOnDestroy() {
    if (this.timerId) { clearInterval(this.timerId); this.timerId = null; }
  }

  private wrap(i:number, len:number){ return (i + 1) % len; }
  private advance(){
    this.i.g  = this.wrap(this.i.g,  this.green.length);
    this.i.y  = this.wrap(this.i.y,  this.yellow.length);
    this.i.b  = this.wrap(this.i.b,  this.blue.length);
    this.i.p  = this.wrap(this.i.p,  this.purple.length);
    this.i.p2 = this.wrap(this.i.p2, this.purple2.length);
    this.i.tl = this.wrap(this.i.tl, this.tanL.length);
    this.i.td = this.wrap(this.i.td, this.tanD.length);
  }

  private apply(){
    const host = this.el.nativeElement;
    host.style.setProperty('--c-green',    this.green[this.i.g]);
    host.style.setProperty('--c-yellow',   this.yellow[this.i.y]);
    host.style.setProperty('--c-blue',     this.blue[this.i.b]);
    host.style.setProperty('--c-purple',   this.purple[this.i.p]);
    host.style.setProperty('--c-purple2',  this.purple2[this.i.p2]);
    host.style.setProperty('--c-tanLight', this.tanL[this.i.tl]);
    host.style.setProperty('--c-tanDark',  this.tanD[this.i.td]);
  }
}
