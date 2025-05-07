import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  OnInit,
  ViewChild,
  effect,
  inject,
  signal, AfterViewInit
} from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter, fromEvent, map, startWith } from 'rxjs';

import { CommonModule } from '@angular/common';
import { FeatureFlagPipe } from '../../utils/feature-flag.pipe';
import { AccessibilityComponent } from '../accessibility/accessibility.component';
import { SearchComponent } from '../search/search.component';
import { UserInfoComponent } from '../user-info/user-info.component';
import { SsrPlatformService } from '../../utils/ssr/ssr-platform.service';
import { OverlayService, OverlayType } from '../../data-access/overlay.service';
import { PageStore } from '../../../pages/data-access/page.store';
import { PanelStore } from '../../ui/panel/panel.store';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [RouterModule, CommonModule, FeatureFlagPipe, UserInfoComponent, SearchComponent, AccessibilityComponent]
})
export class HeaderComponent implements OnInit, AfterViewInit {
  private readonly router = inject(Router);
  private readonly ssr = inject(SsrPlatformService);
  private readonly elementRef = inject(ElementRef);
  readonly overlayService = inject(OverlayService);
  readonly pageStore = inject(PageStore);
  readonly panelStore = inject(PanelStore);

  readonly DESKTOP_BREAKPOINT = 600;

  // Signals
  readonly isNavOpen$$ = signal(false);
  readonly isMobile$$ = signal(false);
  readonly isHomepage$$ = signal(false);
  readonly isSearchOpen$$ = signal(false);
  readonly isAccessibilityOpen$$ = signal(false);

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
          this.overlayService.hideOverlay();
        });
  
      this.setupViewportListener();
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

  private setupViewportListener(): void {
    const resize$ = fromEvent(window, 'resize').pipe(
      debounceTime(200),
      map(() => window.innerWidth),
      startWith(window.innerWidth), // Ensure initial value is set
      distinctUntilChanged(),
      map((width) => ({
        width,
        isMobile: width <= this.DESKTOP_BREAKPOINT
      }))
    );
  
    resize$.pipe(takeUntilDestroyed()).subscribe(({ width, isMobile }) => {
      this.isMobile$$.set(isMobile);
      this.isNavOpen$$.set(!isMobile);
      console.log(`📐 Viewport width: ${width}px — isMobile: ${isMobile}`);
    });
  }
  
  

  ngOnInit(): void {
    if (this.ssr.isServer) return;

    this.pageStore.loadPrimaryNavLinks();
  }

  toggleMobileNavigation(): void {
    if (this.ssr.isServer) return;

    const next = !this.isNavOpen$$();
    this.isNavOpen$$.set(next);
    this.ssr.getDocument()?.documentElement.classList.toggle('nav-open', next);
    console.log(`📱 Nav toggled — isNavOpen: ${next}`);
  }

  // toggleOverlayPanel(overlay: OverlayType): void {
  //   if (this.overlayService.isOverlayActive(overlay)) {
  //     this.overlayService.hideOverlay();
  //   } else {
  //     this.overlayService.showOverlay(overlay);
  //   }
  // }

  closeNavOnLinkClick(): void {
    if (this.ssr.isServer || !this.isMobile$$() || !this.isNavOpen$$()) return;

    this.isNavOpen$$.set(false);
    this.ssr.getDocument()?.body.classList.remove('no-scroll');
    console.log('🔗 Link clicked — nav closed');
  }

  @HostListener('window:resize')
  onResize(): void {
    // Handled by signal/effect already, just clean up body class
    if (!this.isMobile$$()) {
      this.ssr.getDocument()?.body.classList.remove('no-scroll');
      console.log('🖥️ Resized to desktop — scrolling re-enabled');
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (this.ssr.isServer) return;

    const clickedOutside = !this.elementRef.nativeElement.contains(event.target);
    if (this.isMobile$$() && this.isNavOpen$$() && clickedOutside) {
      this.isNavOpen$$.set(false);
      this.ssr.getDocument()?.body.classList.remove('no-scroll');
      console.log('🖱️ Clicked outside — nav closed');
    }
  }

  @HostBinding('class.is-mobile') get isMobileClass() {
    return this.isMobile$$();
  }

  @HostBinding('class.is-homepage') get isHomepageClass() {
    return this.isHomepage$$();
  }
}
