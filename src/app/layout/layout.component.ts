import { Component } from '@angular/core';
import { Cover } from './cover/cover.component';
import { LeftSidebar } from './left-sidebar/left-sidebar.component';
import { Backdrop } from './backdrop/backdrop.component';


@Component({
  selector: 'app-layout',
  imports: [Cover, LeftSidebar, Backdrop],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class Layout {

}
