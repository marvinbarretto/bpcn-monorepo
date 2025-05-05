import { computed, Injectable, signal } from "@angular/core";
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Page, PrimaryNavLink } from "../utils/page.model";
import { PageService } from "./page.service";
import { SsrPlatformService } from "./../../shared/utils/ssr/ssr-platform.service"

@Injectable({
  providedIn: 'root'
})
export class PageStore {
  page$$ = signal<Page | null>(null);
  pages$$ = signal<Page[]>([]);
  loading$$ = signal<boolean>(false);
  error$$ = signal<string | null>(null);

  primaryNavLinks$$ = signal<PrimaryNavLink[]>([]);
  primaryNavLinksComputed$$ = computed(() => this.primaryNavLinks$$());

  constructor(
    private pageService: PageService,
    private platform: SsrPlatformService
  ) {}

  private debugLog(message: string, ...args: any[]) {
    this.platform.onlyOnBrowser(() => {
      console.log(`%c${message}`, 'color: #888;', ...args);
    });
  }

  loadPrimaryNavLinks() {
    if (this.primaryNavLinks$$().length > 0) {
      this.debugLog('Primary navigation pages already loaded');
      this.debugLog('Loaded nav links:', this.primaryNavLinks$$());
      return;
    }
  
    this.loading$$.set(true);
    this.debugLog('📡 Fetching primary navigation pages...');
  
    this.pageService.getPrimaryNavPageLinks().pipe(
      tap(pages => {
        this.primaryNavLinks$$.set(pages);
        this.debugLog(`✅ Loaded ${pages.length} primary nav links:`, pages);
        this.loading$$.set(false);
      }),
      catchError(error => {
        this.error$$.set(`❌ Failed to load nav links: ${error.status} ${error.statusText}`);
        this.debugLog(`❌ Failed to load nav links: ${error.status} ${error.statusText}`, error);
        this.loading$$.set(false);
        return of([]); // fallback
      })
    ).subscribe();
  }
  

  loadPage(slug: string) {
    this.loading$$.set(true);
    this.error$$.set(null);

    this.pageService.getPageBySlug(slug).pipe(
      tap(page => {
        this.page$$.set(page);
        this.debugLog('Page loaded:', page);
        this.loading$$.set(false);
      }),
      catchError(error => {
        const msg = `Failed to load page (${error.status} - ${error.statusText})`;
        this.debugLog(msg, error);

        this.error$$.set(msg);
        this.loading$$.set(false);
        return of(null);
      })
    ).subscribe();
  }

  loadPages() {
    this.loading$$.set(true);
    this.error$$.set(null);

    this.pageService.getPages().pipe(
      tap(pages => {
        this.pages$$.set(pages);
        this.debugLog('Pages loaded:', pages);
        this.loading$$.set(false);
      }),
      catchError(error => {
        const msg = `Failed to load pages (${error.status} - ${error.statusText})`;
        this.debugLog(msg, error);

        this.error$$.set(msg);
        this.loading$$.set(false);
        return of([]);
      })
    ).subscribe();
  }

  getPageBySlug(slug: string) {
    return computed(() => this.pages$$().find(p => p.slug === slug));
  }

  getPrimaryNavPages(): Page[] {
    return this.pages$$().filter(page => page.primaryNavigation === true);
  }

  getRootPages(): Page[] {
    return this.pages$$().filter(page => !page.parentPage);
  }

  getChildPages(parentId: number): Page[] {
    return this.pages$$().filter(page => page.parentPage?.id === parentId);
  }

  hasChildren(pageId: number): boolean {
    return this.getChildPages(pageId).length > 0;
  }
}
