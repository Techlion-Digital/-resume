import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
        // scrollOffset: [0, 64],   // <-- add this (match your sticky header)
      }),
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
    ),
    provideZonelessChangeDetection(),
  ],
};