// logo.component.ts
import { Component } from '@angular/core';
import { CycleDirective } from './cycle.directive';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CycleDirective],
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css']
})
export class Logo {}