import { computed, Injectable, signal } from "@angular/core";
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Page, PrimaryNavLink } from "../utils/page.model";
import { PageService } from "./page.service";

@Injectable({
  providedIn: 'root'
})
export class PageStore {
  page$$ = signal<Page | null>(null);
  pages$$ = signal<Page[]>([]);

  loading$$ = signal<boolean>(false);
  error$$ = signal<string | null>(null);


  // primaryNavLinks$$ is a writable signal that holds the data
  // but if we talk to it directly we will not get the reactivity
  primaryNavLinks$$ = signal<PrimaryNavLink[]>([]);

  // primaryNavLinksComputed$$ is a computed signal that
  // reactively tracks changes to primaryNavLinks$$
  primaryNavLinksComputed$$ = computed(() => this.primaryNavLinks$$());



  getPageBySlug(slug: string) {
    return computed(() => this.pages$$().find(p => p.slug === slug));
  }

  constructor(private pageService: PageService) {

  }


  // TODO: 1. set HTTP Cache-Control Headers on Strapi for a day 86400

  loadPrimaryNavLinks() {
    if ( this.primaryNavLinks$$().length > 0 ) {
      console.log('%cPrimary navigation pages already loaded', 'color: green');
      console.log(this.primaryNavLinks$$());  // Output the actual list of pages
      return;
    }
    this.loading$$.set(true);

    console.log('Making API call to fetch primary nav links...');
    this.pageService.getPrimaryNavPageLinks().pipe(
      tap( pages => {
        console.log('%cAPI response:', 'color: orange');
        console.log(pages);  // Check if pages contain valid slugs


        this.primaryNavLinks$$.set(pages);
        console.log('%cPrimary navigation pages loaded:', 'color: green');
        console.log(pages);  // Output the fetched pages after loading

        this.loading$$.set(false);
      }),
      catchError((error) => {
        this.error$$.set(`Failed to load primary navigation pages. ${error}`);
        this.loading$$.set(false);
        return of([]);
      })
    ).subscribe();
  }

  loadPage(slug: string) {
    this.loading$$.set(true);
    this.error$$.set(null);

    this.pageService.getPageBySlug(slug).pipe(
      tap(page => {
        this.page$$.set(page);
        console.log('Page loaded: ', this.page$$());
        this.loading$$.set(false);
      }),
      catchError((error) => {
        this.error$$.set(`Failed to load page. ${error}`);
        this.loading$$.set(false);
        return of(null);
      })
    ).subscribe();
  }

  loadPages() {
    this.loading$$.set(true);
    this.error$$.set(null);

    this.pageService.getPages().pipe(
      tap( pages => {
        this.pages$$.set(pages);
        console.log('Pages loaded: ', this.pages$$());
        this.loading$$.set(false);
      }),
      catchError((error) => {
        this.error$$.set(`Failed to load pages. ${error}`);
        this.loading$$.set(false);
        return of([]);
      })
    ).subscribe();
  }

  getPrimaryNavPages(): Page[] {
    return this.pages$$().filter( page => page.primaryNavigation === true );
  }

  getRootPages(): Page[] {
    return this.pages$$().filter( page => !page.parentPage );
  }

  getChildPages(parentId: number): Page[] {
    return this.pages$$().filter( page => page.parentPage?.id === parentId);
  }

  hasChildren(pageId: number): boolean {
    return this.getChildPages(pageId).length > 0;
  }
}
