import {
  Component,
  ElementRef,
  HostBinding,
  OnInit,
  ViewChild,
  inject,
  signal, AfterViewInit
} from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter, fromEvent, map, startWith } from 'rxjs';

import { CommonModule } from '@angular/common';
import { FeatureFlagPipe } from '../../utils/feature-flag.pipe';
import { UserInfoComponent } from '../user-info/user-info.component';
import { SsrPlatformService } from '../../utils/ssr/ssr-platform.service';
import { PageStore } from '../../../pages/data-access/page.store';
import { PanelStore } from '../../ui/panel/panel.store';
import { ViewportService } from '../../data-access/viewport.service';
import { BREAKPOINTS } from '../../utils/constants';
import { NavComponent } from "../nav/nav.component";

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [RouterModule, CommonModule, FeatureFlagPipe, UserInfoComponent, NavComponent]
})
export class HeaderComponent implements OnInit, AfterViewInit {
  private readonly router = inject(Router);
  private readonly ssr = inject(SsrPlatformService);
  private readonly elementRef = inject(ElementRef);
  readonly pageStore = inject(PageStore);
  readonly panelStore = inject(PanelStore);

  // Signals
  // readonly isNavOpen$$ = signal(false);
  readonly isMobile$$ = inject(ViewportService).isMobile$$;
  readonly isHomepage$$ = signal(false);

  constructor() {
    this.ssr.logContext('HeaderComponent');
  
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event) => {
        const isHome = event.url === '/';
        this.isHomepage$$.set(isHome);
        console.log(`🏠 Route changed — isHomepage: ${isHome}`);
      });
  
    if (this.ssr.isBrowser) {
      this.router.events
        .pipe(
          filter((e): e is NavigationEnd => e instanceof NavigationEnd),
          takeUntilDestroyed()
        )
        .subscribe(() => {
          // this.overlayService.hideOverlay();
        });
  
    }
  }

  ngAfterViewInit(): void {
    this.updatePanelOrigin();
  }

  @ViewChild('headerRef', { static: false }) headerRef!: ElementRef;

  private updatePanelOrigin() {
    const rect = this.headerRef?.nativeElement?.getBoundingClientRect();
    const offsetY = rect.bottom + window.scrollY; // in case page is scrolled
    this.panelStore.setOriginY(offsetY);
  }


  @ViewChild('panelTrigger', { static: false }) panelTriggerRef!: ElementRef;
  openThemePanel() {
    const button = this.panelTriggerRef?.nativeElement as HTMLElement;

    // Get distance from top of page to bottom of button
    const y = button?.getBoundingClientRect().bottom + window.scrollY;
  
    // Pass this to the panel store
    this.panelStore.openAt('theme', y);
  
    // TODO: close nav if needed
  }

  openMobileNavPanel() {
    if (this.panelStore.activePanel() === 'nav') {
      this.panelStore.close();
    } else {
      this.panelStore.open('nav');
    }
  
    // Optionally: close other overlays or nav state here
  }


  
  

  ngOnInit(): void {
    if (this.ssr.isServer) return;

    this.pageStore.loadPrimaryNavLinks();
  }






  @HostBinding('class.is-mobile') get isMobileClass() {
    return this.isMobile$$();
  }

  @HostBinding('class.is-homepage') get isHomepageClass() {
    return this.isHomepage$$();
  }
}
