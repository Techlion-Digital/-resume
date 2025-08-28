import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-backdrop',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './backdrop.html',
  styleUrl: './backdrop.css'
})
export class Backdrop {

}
