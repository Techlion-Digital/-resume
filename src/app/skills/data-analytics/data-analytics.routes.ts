import { Routes } from '@angular/router';

export const DATA_ANALYTICS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./data-analytics.component').then(m => m.DataAnalyticsComponent),
    children: [
      {
        path: '', redirectTo: 'algorithms', pathMatch: 'full'
      },
      {
        path: 'algorithms',
        loadComponent: () =>
          import('./algorithms/algorithms.component').then(m => m.AlgorithmsComponent),
        data: { title: 'Algorithms' }
      },
      {
        path: 'data-visualization',
        loadComponent: () =>
          import('./data-visualization/data-visualization.component').then(m => m.DataVisualizationComponent),
        data: { title: 'Data Visualization' }
      },
      {
        path: 'data-storytelling',
        loadComponent: () =>
          import('./data-storytelling/data-storytelling.component').then(m => m.DataStorytellingComponent),
        data: { title: 'Data Storytelling' }
      }
    ]
  }
];
