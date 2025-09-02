import { Routes } from '@angular/router';

export const WEB_ENGINEERING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./web-engineering.component').then(m => m.WebEngineeringComponent),
    children: [
      { 
        path: '', redirectTo: 'front-end', pathMatch: 'full' 
      },
      {
        path: 'front-end',
        loadComponent: () =>
          import('./front-end/front-end.component').then(m => m.FrontEndComponent),
        data: { title: 'Front End' }
      },
      {
        path: 'back-end',
        loadComponent: () =>
          import('./back-end/back-end.component').then(m => m.BackEndComponent),
        data: { title: 'Back End' }
      },
      {
        path: 'devops',
        loadComponent: () =>
          import('./devops/devops.component').then(m => m.DevOpsComponent),
        data: { title: 'DevOps' }
      }
    ]
  }
];