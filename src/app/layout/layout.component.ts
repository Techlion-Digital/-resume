import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { Cover } from './cover/cover.component';
import { LeftSidebar } from './left-sidebar/left-sidebar.component';
import { Backdrop } from './backdrop/backdrop.component';
import { CommonModule } from '@angular/common';
import { Content } from './content/content.component';
import { AfterViewInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Router, Scroll, Event as RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DestroyRef } from '@angular/core';

@Component({
  selector: 'app-layout',
  imports: [Cover, Backdrop, CommonModule, Content],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class Layout implements OnInit, AfterViewInit{
  // Initialization
  showtime = false;
  constructor(private zone: NgZone, private cdr: ChangeDetectorRef,private router: Router, private vp: ViewportScroller, private destroyRef: DestroyRef) {
    console.log('AppLayout init', performance.now());
  }

  ngOnInit(): void {
     setTimeout(() => {
      this.zone.run(() => {
        this.showtime = true;
        this.cdr.markForCheck();
      });
    }, 1400); 
    
  }

  ngAfterViewInit() {
      // keep this in sync with app.config.ts
      this.vp.setOffset([0, 64]);

      const sub = this.router.events
      .pipe(filter((e): e is Scroll => e instanceof Scroll))
      .subscribe(e => {
        if (e.anchor) this.scrollToAnchorRobust(e.anchor);
      });

      this.destroyRef.onDestroy(() => sub.unsubscribe());
    }

    private scrollToAnchorRobust(anchor: string) {
      const HEADER = 64;           // adjust to your sticky header height
      let tries = 0;
      const maxTries = 20;         // ~1s total
      const stepMs = 50;

      const tryScroll = () => {
        const el = document.getElementById(anchor);
        if (el) {
          const y = Math.max(
            0,
            window.scrollY + el.getBoundingClientRect().top - HEADER
          );
          // Smooth scroll the WINDOW
          window.scrollTo({ top: y, behavior: 'smooth' });
          // Debug (remove later)
          // console.log('[anchor ok]', anchor, 'y=', y);
          return;
        }
        if (tries++ < maxTries) setTimeout(tryScroll, stepMs);
      };

      // kick on next frame so routed view has rendered
      requestAnimationFrame(tryScroll);
    }

}
