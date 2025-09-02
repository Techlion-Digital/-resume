import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { Cover } from './cover/cover.component';
import { LeftSidebar } from './left-sidebar/left-sidebar.component';
import { Backdrop } from './backdrop/backdrop.component';
import { CommonModule } from '@angular/common';
import { Content } from './content/content.component';

@Component({
  selector: 'app-layout',
  imports: [Cover, Backdrop, CommonModule, Content],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class Layout implements OnInit{
  // Initialization
  showtime = false;
  constructor(private zone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
     setTimeout(() => {
      this.zone.run(() => {
        this.showtime = true;
        this.cdr.markForCheck();
      });
    }, 1400); 
  }
}
