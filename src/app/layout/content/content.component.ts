import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { LeftSidebar } from "../left-sidebar/left-sidebar.component";

@Component({
  standalone: true,
  selector: 'app-content',
  imports: [CommonModule, RouterModule, LeftSidebar],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class Content implements OnInit{
  // Initialization
  showtime = false;
  constructor(private zone: NgZone, private cdr: ChangeDetectorRef, private vp: ViewportScroller) {}

 ngOnInit() {
    const setSidebarHeight = () => {
      const sidebar = document.querySelector('app-left-sidebar') as HTMLElement;
      const contentScroll = document.getElementById('contentScroll') as HTMLElement;

      if (sidebar) {
        if (window.innerWidth < 1040) {
          sidebar.style.height = `${window.innerHeight}px`;
          contentScroll.style.height = `${window.innerHeight}px`;
        }
      }
    };

    setSidebarHeight();
    window.addEventListener('resize', setSidebarHeight);
  }

  scrollToTop(): void {
    setTimeout(() => {
      const contentScroll = document.getElementById('mainContent') as HTMLElement;
      if (contentScroll) {
        contentScroll.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

}
