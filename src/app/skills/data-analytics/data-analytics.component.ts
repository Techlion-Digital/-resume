import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-data-analytics',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './data-analytics.component.html',
  styleUrls: ['./data-analytics.component.css'],
})
export class DataAnalyticsComponent {}