import { Component, OnInit, HostListener, ElementRef, PLATFORM_ID, Inject, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { PageStore } from '../../../pages/data-access/page.store';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs';
import { FeatureFlagPipe } from '../../utils/feature-flag.pipe';
import { SearchComponent } from '../search/search.component';
import { UserInfoComponent } from '../user-info/user-info.component';
import { AccessibilityComponent } from "../accessibility/accessibility.component";
import { OverlayService, OverlayType } from '../../data-access/overlay.service';

@Component({
    selector: 'app-header',
    imports: [RouterModule, CommonModule, FeatureFlagPipe, UserInfoComponent, SearchComponent, AccessibilityComponent],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isSearchOpen = false;
  isAccessibilityOpen = false;
  isHomepage = false;
  isNavOpen = false;
  isMobile = false;
  readonly DESKTOP_BREAKPOINT = 600 // TODO: Could this be stored somewhere better where more components can access it?

  private router = inject(Router);
  public overlayService = inject(OverlayService);

  constructor(
    public pageStore: PageStore,
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Q: What exactly is this doing? What is NavigationEnd?
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(() => {
        this.overlayService.hideOverlay();
      });
  }

  ngOnInit() {
    this.checkViewportSize();
    this.pageStore.loadPrimaryNavLinks();
    this.checkIfUserIsOnHomepage();
  }

  toggleOverlay(overlay: OverlayType) {
    if ( this.overlayService.isOverlayActive(overlay) ) {
      this.overlayService.hideOverlay();
    } else {
      this.overlayService.showOverlay(overlay);
    }
  }


  private checkIfUserIsOnHomepage() {
    // Safe way to know for sure if the user is on the homepage
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    ).subscribe((event: any) => {
      this.isHomepage = (event.url === '/');
    });
  }


  // Check viewport size and adjust isMobile and isNavOpen accordingly
  private checkViewportSize() {
    if (isPlatformBrowser(this.platformId)) {
      const isCurrentlyMobile = window.innerWidth <= this.DESKTOP_BREAKPOINT;

      // If switching from desktop to mobile, close the nav
      if (isCurrentlyMobile && !this.isMobile) {
        this.isNavOpen = false;  // Hide nav when switching to mobile
        console.log('Switched to mobile: Nav is closed');
      }

      // If switching from mobile to desktop, always show the nav
      if (!isCurrentlyMobile) {
        this.isNavOpen = true;   // Ensure nav is open on desktop
        console.log('Switched to desktop: Nav is open');
      }

      this.isMobile = isCurrentlyMobile;  // Update the isMobile flag
      console.log(`Viewport isMobile: ${this.isMobile}`);
    }
  }

  // Method to toggle the mobile navigation
  toggleMobileNavigation() {
    if (this.isMobile && isPlatformBrowser(this.platformId)) {
      this.isNavOpen = !this.isNavOpen;

      // Add or remove the class on the root <html> element based on nav state
      if (this.isNavOpen) {
        document.documentElement.classList.add('nav-open'); // Add class to <html>
        console.log('Nav opened: Added class "nav-open" to <html>');
      } else {
        document.documentElement.classList.remove('nav-open'); // Remove class from <html>
        console.log('Nav closed: Removed class "nav-open" from <html>');
      }

      console.log(`Nav toggled: isNavOpen=${this.isNavOpen}`);
    }
  }

  // Close the nav when a user clicks outside of it
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.isMobile && this.isNavOpen && !this.elementRef.nativeElement.contains(event.target) && isPlatformBrowser(this.platformId)) {
      this.isNavOpen = false;
      document.body.classList.remove('no-scroll');  // Re-enable scrolling when the nav is closed

      console.log('Clicked outside: Nav is closed');
    }
  }

  // Close the nav when a menu link is clicked
  closeNavOnLinkClick() {
    console.log('Link clicked');
    if (this.isMobile && this.isNavOpen && isPlatformBrowser(this.platformId)) {
      this.isNavOpen = false;
      document.body.classList.remove('no-scroll');  // Re-enable scrolling when the nav is closed

      console.log('Link clicked: Nav is closed');
    }
  }

  // Listen for window resize events
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkViewportSize();

    // If resizing to desktop, re-enable scrolling if it was disabled
    if (!this.isMobile && document.body.classList.contains('no-scroll') && isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('no-scroll');
      console.log('Resized to desktop: Scrolling enabled');
    }
  }
}
