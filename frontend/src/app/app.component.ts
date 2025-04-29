import { Component } from '@angular/core';
import { RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { HeaderComponent } from "./shared/feature/header/header.component";
import { FooterComponent } from './shared/feature/footer/footer.component';
import { filter, mergeMap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { PageTitleService } from './shared/data-access/page-title.service';
import { BackendHealthService } from './shared/data-access/backend-health.service';
import { CommonModule } from '@angular/common';
import { UserPreferencesStore } from './shared/data-access/user-preferences.store';
import { OverlayService } from './shared/data-access/overlay.service';

@Component({
    selector: 'app-root',
    imports: [RouterModule, HeaderComponent, FooterComponent, CommonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  isBackendAvailable!: () => boolean;

  constructor(
    private titleService: PageTitleService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private backendHealthService: BackendHealthService,
    private userPreferencesStore: UserPreferencesStore,
    public overlayService: OverlayService
  ) {
    this.isBackendAvailable = this.backendHealthService.isStrapiAvailable$$;
  }
  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        // Traverse the route tree to find the deepest child
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      mergeMap(route => route.data),
      map(data => data['title']) // Access the 'title' from route data
    ).subscribe(title => {
      this.titleService.setTitle(title);
    });
  }
}
