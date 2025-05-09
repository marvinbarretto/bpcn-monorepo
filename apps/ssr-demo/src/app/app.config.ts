import { APP_INITIALIZER, ApplicationConfig, ErrorHandler, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { environment } from '../environments/environment';
import { GlobalErrorHandler } from './shared/utils/global-error-handler';
import { authInterceptor } from './auth/data-access/auth.interceptor';
import { provideAuthInitializer } from './auth/data-access/auth-initializer';
import { USER_THEME_TOKEN } from '../libs/tokens/user-theme.token';
import { ThemeStore } from './shared/data-access/theme.store';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: USER_THEME_TOKEN, useValue: 'Default' },
    provideAppInitializer(() => { inject(ThemeStore); }),
    provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAuthInitializer(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: 'environment', useValue: environment },

  ],
};

console.log('✅ appConfig successfully defined');
