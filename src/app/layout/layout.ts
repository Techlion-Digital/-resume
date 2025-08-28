import { Component } from '@angular/core';
import { Cover } from './cover/cover';
import { LeftSidebar } from './left-sidebar/left-sidebar';
import { Backdrop } from './backdrop/backdrop';


@Component({
  selector: 'app-layout',
  imports: [Cover, LeftSidebar, Backdrop],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {

}
