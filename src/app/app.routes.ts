import { Routes } from '@angular/router';
import { Layout } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: Layout,            // shell
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./skills/intro.component').then(m => m.IntroComponent),
        data: { title: 'Intro' }
      },
      {
        path: 'web-engineering',
        loadChildren: () =>
          import('./skills/web-engineering/web-engineering.routes')
          .then(m => m.WEB_ENGINEERING_ROUTES)
      },
      {
        path: 'data-analytics',
        loadChildren: () =>
          import('./skills/data-analytics/data-analytics.routes')
          .then(m => m.DATA_ANALYTICS_ROUTES)
      },
      {
        path: 'ux-ui',
        loadChildren: () =>
          import('./skills/uxui/uxui.routes')
          .then(m => m.UXUI_ROUTES)
      },
      {
        path: 'process-engineering',
        loadChildren: () =>
          import('./skills/process/process.routes')
          .then(m => m.PROCESS_ENGINEERING_ROUTES)
      }
      //{
       // path: '**',
        //loadComponent: () =>
          //import('./shared/not-found/not-found.component').then(m => m.NotFoundComponent),
        //data: { title: 'Not found' }
      //}
    ]
  }
];
