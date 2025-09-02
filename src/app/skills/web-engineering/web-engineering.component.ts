import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-web-engineering',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './web-engineering.component.html',
  styleUrls: ['./web-engineering.component.css']
})
export class WebEngineeringComponent {}