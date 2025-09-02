import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  constructor(private zone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
     
  }
}
