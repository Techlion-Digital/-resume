import { Routes } from '@angular/router';

export const PROCESS_ENGINEERING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./process.component').then(m => m.ProcessComponent),
    children: [
      { 
        path: '', redirectTo: 'agile', pathMatch: 'full' 
      },
      {
        path: 'agile',
        loadComponent: () =>
          import('./agile/agile.component').then(m => m.AgileComponent),
        data: { title: 'Agile' }
      },
      {
        path: 'sdlc',
        loadComponent: () =>
          import('./sdlc/sdlc.component').then(m => m.SDLCComponent),
        data: { title: 'SDLC' }
      },
      {
        path: 'culture',
        loadComponent: () =>
          import('./culture/culture.component').then(m => m.CultureComponent),
        data: { title: 'Culture' }
      }
    ]
  }
];