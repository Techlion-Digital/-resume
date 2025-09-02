import { Routes } from '@angular/router';

export const UXUI_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./uxui.component').then(m => m.UXUIComponent),
    children: [
      { 
        path: '', redirectTo: 'design-systems', pathMatch: 'full' 
      },
      {
        path: 'design-systems',
        loadComponent: () =>
          import('./design-systems/design-systems.component').then(m => m.DesignSystemsComponent),
        data: { title: 'Design Systems' }
      },
      {
        path: 'interaction-design',
        loadComponent: () =>
          import('./interaction-design/interaction-design.component').then(m => m.InteractionDesignComponent),
        data: { title: 'Interaction Design' }
      },
      {
        path: 'research',
        loadComponent: () =>
          import('./research/research.component').then(m => m.ResearchComponent),
        data: { title: 'Research' }
      }
    ]
  }
];