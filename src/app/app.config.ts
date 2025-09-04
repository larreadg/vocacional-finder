import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { seedIfNeeded } from './seed';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export function seedFactory() {
  return () => seedIfNeeded();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideHttpClient(),
    provideAnimations(),
    { provide: APP_INITIALIZER, useFactory: seedFactory, multi: true }
  ]
};
