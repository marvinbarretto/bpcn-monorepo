import { Routes } from '@angular/router';
import { LoginComponent } from './auth/feature/login/login.component';
import { RegisterComponent } from './auth/feature/register/register.component';
import { authGuard } from './auth/data-access/auth.guard';
import { HomeComponent } from './home/feature/home/home.component';
import { SiteMapComponent } from './pages/feature/site-map/site-map.component';
import { PageResolverService } from './pages/data-access/page.resolver';
import { pageGuard } from './pages/data-access/page.guard';
import {
  UrlSegment,
  Route,
  UrlSegmentGroup,
  UrlMatchResult,
} from '@angular/router';
import { NewsListComponent } from './news/feature/news-list/news-list.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' },
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { title: 'Register' },
  },
  {
    path: 'news',
    component: NewsListComponent,
    data: { title: 'News' },
  },
  {
    path: 'site-map',
    component: SiteMapComponent,
    data: { title: 'Site Map' },
  },
  {
    path: 'events',
    loadChildren: () =>
      import('./events/events.routes').then((m) => m.EVENTS_ROUTES),
    data: { title: 'Events' },
  },
  // Only works for single-segment routes
  {
    path: ':slug',
    loadComponent: () =>
      import('./pages/feature/page/page.component').then(
        (m) => m.PageComponent
      ),
    resolve: { page: PageResolverService }, // Resolve page from CMS first
    canActivate: [pageGuard], // Be resilient for conflicts
  },
  {
    matcher: multiSegmentMatcher, // Use custom matcher for multi-segment slugs
    loadComponent: () =>
      import('./pages/feature/page/page.component').then(
        (m) => m.PageComponent
      ),
    resolve: { page: PageResolverService },
    canActivate: [pageGuard], // Add your guard if needed
  },
  {
    path: '**',
    redirectTo: '/',
  },
];

// Custom matcher to handle multi-segment routes
export function multiSegmentMatcher(
  segments: UrlSegment[],
  group: UrlSegmentGroup,
  route: Route
): UrlMatchResult | null {
  const slug = segments.map((s) => s.path).join('/'); // Join all segments into a single slug

  // If there are segments, return the combined slug
  if (segments.length) {
    return {
      consumed: segments, // All segments are consumed as part of this route
      posParams: { slug: new UrlSegment(slug, {}) }, // Return the combined slug
    };
  }

  return null; // No match if there are no segments
}
